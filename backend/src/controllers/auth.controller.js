import { User } from '../models/index.js';
import {
  createLoginChallenge,
  findActiveChallengeByRawToken,
  invalidateChallenge
} from '../services/challenge.service.js';
import { sendOtpEmail } from '../services/email.service.js';
import { signAuthToken, signSetupToken } from '../services/jwt.service.js';
import { compareOtp, generateOtpCode, hashOtp } from '../services/otp.service.js';
import {
  decryptTotpSecret,
  getTotpStep,
  verifyTotpToken
} from '../services/totp.service.js';
import { logSecurityEvent } from '../services/security-log.service.js';
import { fail, success } from '../utils/response.js';

const maxEmailAttempts = Number(process.env.AUTH_OTP_MAX_ATTEMPTS || 5);
const maxTotpAttempts = Number(process.env.AUTH_TOTP_MAX_ATTEMPTS || 5);
const maxResendCount = Number(process.env.AUTH_OTP_RESEND_MAX || 3);
const resendCooldownMs = Number(process.env.AUTH_OTP_RESEND_COOLDOWN_SECONDS || 60) * 1000;

function genericLoginError() {
  return 'Unable to start authentication flow';
}

async function getChallengeOrFail(challengeToken, req, res) {
  const challenge = await findActiveChallengeByRawToken(challengeToken, req);

  if (!challenge) {
    fail(res, 'Challenge not found, expired or already completed', 404);
    return null;
  }

  if (!challenge.user || challenge.user.status !== 'active') {
    await invalidateChallenge(challenge);
    fail(res, 'User not available', 401);
    return null;
  }

  return challenge;
}

function userPayload(user) {
  return {
    id: user.id,
    full_name: user.full_name,
    email: user.email,
    role: user.role,
    totp_enabled: user.totp_enabled
  };
}

export async function firebaseLogin(req, res) {
  const { uid, email, name } = req.firebaseUser;
  logSecurityEvent('login_initiated', { email, uid, ip: req.ip });

  if (!email) {
    return fail(res, genericLoginError(), 400);
  }

  let user = await User.findOne({ where: { email } });

  if (!user) {
    user = await User.create({
      firebase_uid: uid,
      email,
      full_name: name || email.split('@')[0],
      role: 'user',
      status: 'active'
    });
  } else if (user.firebase_uid !== uid) {
    user.firebase_uid = uid;
    if (!user.full_name && name) {
      user.full_name = name;
    }
    await user.save();
  }

  if (user.status !== 'active') {
    return fail(res, genericLoginError(), 403);
  }

  const otp = generateOtpCode();
  const emailOtpHash = await hashOtp(otp);
  const { rawToken } = await createLoginChallenge({
    req,
    userId: user.id,
    emailOtpHash
  });

  try {
    await sendOtpEmail({ to: user.email, code: otp, name: user.full_name });
  } catch {
    return fail(res, 'Could not send verification email. Try again later.', 503);
  }

  logSecurityEvent('otp_sent', { userId: user.id, email: user.email, ip: req.ip });

  return success(res, {
    challengeToken: rawToken,
    requiresEmailOtp: true,
    requiresTotp: user.totp_enabled
  }, 'Verification code sent.');
}

export async function resendEmailOtp(req, res) {
  const { challengeToken } = req.body;
  const challenge = await getChallengeOrFail(challengeToken, req, res);

  if (!challenge) {
    return;
  }

  if (challenge.completed) {
    return fail(res, 'Challenge already completed', 400);
  }

  if (challenge.resend_count >= maxResendCount) {
    await invalidateChallenge(challenge);
    logSecurityEvent('user_blocked_resend_limit', { userId: challenge.user.id, ip: req.ip });
    return fail(res, 'Maximum OTP resend attempts reached', 429);
  }

  if (challenge.last_resend_at && Date.now() - new Date(challenge.last_resend_at).getTime() < resendCooldownMs) {
    return fail(res, 'Please wait before requesting another OTP', 429);
  }

  const otp = generateOtpCode();
  challenge.email_otp_hash = await hashOtp(otp);
  challenge.email_otp_expires_at = new Date(Date.now() + Number(process.env.AUTH_OTP_TTL_MINUTES || 5) * 60 * 1000);
  challenge.attempts_email = 0;
  challenge.email_verified_step = false;
  challenge.resend_count += 1;
  challenge.last_resend_at = new Date();
  await challenge.save();

  try {
    await sendOtpEmail({ to: challenge.user.email, code: otp, name: challenge.user.full_name });
  } catch {
    return fail(res, 'Could not send verification email. Try again later.', 503);
  }

  logSecurityEvent('otp_resent', { userId: challenge.user.id, resendCount: challenge.resend_count, ip: req.ip });

  return success(res, { resent: true }, 'Verification code resent.');
}

export async function verifyEmailOtp(req, res) {
  const { challengeToken, otp } = req.body;
  const challenge = await getChallengeOrFail(challengeToken, req, res);

  if (!challenge) {
    return;
  }

  if (challenge.attempts_email >= maxEmailAttempts) {
    await invalidateChallenge(challenge);
    logSecurityEvent('user_blocked_email_attempts', { userId: challenge.user.id, ip: req.ip });
    return fail(res, 'Maximum OTP attempts reached', 429);
  }

  if (new Date(challenge.email_otp_expires_at) < new Date()) {
    await invalidateChallenge(challenge);
    return fail(res, 'OTP expired', 400);
  }

  const isValid = await compareOtp(otp, challenge.email_otp_hash);
  challenge.attempts_email += 1;

  if (!isValid) {
    await challenge.save();
    logSecurityEvent('otp_failed', { userId: challenge.user.id, attempt: challenge.attempts_email, ip: req.ip });

    if (challenge.attempts_email >= maxEmailAttempts) {
      await invalidateChallenge(challenge);
      logSecurityEvent('user_blocked_email_attempts', { userId: challenge.user.id, ip: req.ip });
    }

    return fail(res, 'Invalid verification code', 400);
  }

  challenge.email_verified_step = true;
  await challenge.save();
  logSecurityEvent('otp_verified', { userId: challenge.user.id, ip: req.ip });

  if (!challenge.user.totp_enabled) {
    const setupToken = signSetupToken(challenge.user, challengeToken);

    return success(res, {
      challengeToken,
      requiresTotpSetup: true,
      setupToken
    });
  }

  return success(res, {
    challengeToken,
    pendingTotp: true
  });
}

export async function verifyTotp(req, res) {
  const { challengeToken, token } = req.body;
  const challenge = await getChallengeOrFail(challengeToken, req, res);

  if (!challenge) {
    return;
  }

  if (!challenge.email_verified_step) {
    return fail(res, 'Email OTP must be verified first', 400);
  }

  if (challenge.attempts_totp >= maxTotpAttempts) {
    await invalidateChallenge(challenge);
    logSecurityEvent('user_blocked_totp_attempts', { userId: challenge.user.id, ip: req.ip });
    return fail(res, 'Maximum TOTP attempts reached', 429);
  }

  if (!challenge.user.totp_enabled || !challenge.user.totp_secret_encrypted) {
    return fail(res, 'TOTP is not configured for this user', 400);
  }

  const currentStep = getTotpStep();
  if (challenge.user.last_totp_step && Number(challenge.user.last_totp_step) === currentStep) {
    return fail(res, 'TOTP code already used in this time window', 400);
  }

  const secret = decryptTotpSecret(challenge.user.totp_secret_encrypted);
  const isValid = verifyTotpToken({ secret, token });
  challenge.attempts_totp += 1;

  if (!isValid) {
    await challenge.save();
    logSecurityEvent('totp_failed', { userId: challenge.user.id, attempt: challenge.attempts_totp, ip: req.ip });

    if (challenge.attempts_totp >= maxTotpAttempts) {
      await invalidateChallenge(challenge);
      logSecurityEvent('user_blocked_totp_attempts', { userId: challenge.user.id, ip: req.ip });
    }

    return fail(res, 'Invalid TOTP code', 400);
  }

  challenge.totp_verified_step = true;
  challenge.completed = true;
  await challenge.save();

  challenge.user.last_totp_step = currentStep;
  challenge.user.last_login_at = new Date();
  await challenge.user.save();

  if (
    !challenge.email_verified_step ||
    !challenge.totp_verified_step ||
    !challenge.completed ||
    new Date(challenge.expires_at) < new Date() ||
    challenge.user.status !== 'active'
  ) {
    return fail(res, 'Unable to finalize authentication', 400);
  }

  const authToken = signAuthToken(challenge.user);
  logSecurityEvent('totp_verified', { userId: challenge.user.id, ip: req.ip });
  logSecurityEvent('jwt_issued', { userId: challenge.user.id, role: challenge.user.role, ip: req.ip });

  return success(res, {
    token: authToken,
    user: userPayload(challenge.user)
  });
}

export async function me(req, res) {
  return success(res, {
    id: req.user.id,
    full_name: req.user.full_name,
    email: req.user.email,
    role: req.user.role,
    status: req.user.status,
    totp_enabled: req.user.totp_enabled,
    last_login_at: req.user.last_login_at
  });
}
