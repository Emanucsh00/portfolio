import { LoginChallenge } from '../models/index.js';
import { getNumberEnv } from '../config/env.js';
import { signAuthToken } from '../services/jwt.service.js';
import {
  buildTotpSetupPayload,
  decryptTotpSecret,
  encryptTotpSecret,
  generateTotpSecret,
  getTotpStep,
  verifyTotpToken
} from '../services/totp.service.js';
import { logSecurityEvent } from '../services/security-log.service.js';
import { fail, success } from '../utils/response.js';
import { hashChallengeToken } from '../services/challenge.service.js';

const pendingTotpTtlMinutes = getNumberEnv('AUTH_TOTP_SETUP_TTL_MINUTES', 10);

function clearPendingTotp(user) {
  user.pending_totp_secret_encrypted = null;
  user.pending_totp_expires_at = null;
}

export async function setupTotp(req, res) {
  if (req.user.totp_enabled && req.user.totp_secret_encrypted) {
    return fail(res, 'TOTP is already enabled for this user', 400);
  }

  const secret = generateTotpSecret(req.user.email);
  const payload = await buildTotpSetupPayload(secret);
  const expiresAt = new Date(Date.now() + pendingTotpTtlMinutes * 60 * 1000);

  req.user.pending_totp_secret_encrypted = encryptTotpSecret(secret.base32);
  req.user.pending_totp_expires_at = expiresAt;
  await req.user.save();

  logSecurityEvent('totp_setup_started', { userId: req.user.id, ip: req.ip, expiresAt });

  return success(res, {
    ...payload,
    expiresAt
  });
}

export async function confirmTotp(req, res) {
  const { token } = req.body;

  if (!token) {
    return fail(res, 'token is required', 400);
  }

  const currentStep = getTotpStep();
  if (req.user.last_totp_step && Number(req.user.last_totp_step) === currentStep) {
    return fail(res, 'TOTP code already used in this time window', 400);
  }

  if (!req.user.pending_totp_secret_encrypted || !req.user.pending_totp_expires_at) {
    return fail(res, 'No pending TOTP setup found. Start setup again.', 400);
  }

  if (new Date(req.user.pending_totp_expires_at) <= new Date()) {
    clearPendingTotp(req.user);
    await req.user.save();
    logSecurityEvent('totp_setup_expired', { userId: req.user.id, ip: req.ip });
    return fail(res, 'TOTP setup expired. Start setup again.', 400);
  }

  const pendingSecret = decryptTotpSecret(req.user.pending_totp_secret_encrypted);
  const isValid = verifyTotpToken({ secret: pendingSecret, token });
  if (!isValid) {
    logSecurityEvent('totp_setup_failed', { userId: req.user.id, ip: req.ip });
    return fail(res, 'Invalid TOTP code', 400);
  }

  req.user.totp_secret_encrypted = req.user.pending_totp_secret_encrypted;
  req.user.totp_enabled = true;
  req.user.last_totp_step = currentStep;
  req.user.last_login_at = new Date();
  clearPendingTotp(req.user);
  await req.user.save();

  if (req.auth?.type === 'totp_setup') {
    const challenge = await LoginChallenge.findOne({
      where: {
        challenge_token_hash: hashChallengeToken(req.auth.challengeToken),
        user_id: req.user.id
      }
    });

    if (!challenge || new Date(challenge.expires_at) <= new Date() || challenge.completed) {
      return fail(res, 'Challenge not found or expired', 400);
    }

    challenge.email_verified_step = true;
    challenge.totp_verified_step = true;
    challenge.completed = true;
    await challenge.save();

    logSecurityEvent('totp_activated', { userId: req.user.id, ip: req.ip });
    logSecurityEvent('jwt_issued', { userId: req.user.id, role: req.user.role, ip: req.ip });

    return success(res, {
      token: signAuthToken(req.user),
      user: {
        id: req.user.id,
        full_name: req.user.full_name,
        email: req.user.email,
        role: req.user.role,
        totp_enabled: req.user.totp_enabled
      }
    });
  }

  logSecurityEvent('totp_activated', { userId: req.user.id, ip: req.ip });
  return success(res, { totp_enabled: true }, 'TOTP configured successfully');
}

export async function disableTotp(req, res) {
  const { token } = req.body;

  if (!req.user.totp_enabled || !req.user.totp_secret_encrypted) {
    return fail(res, 'TOTP is not enabled', 400);
  }

  const secret = req.user.totp_secret_encrypted
    ? decryptTotpSecret(req.user.totp_secret_encrypted)
    : null;

  if (!secret || !verifyTotpToken({ secret, token })) {
    logSecurityEvent('totp_disable_failed', { userId: req.user.id, ip: req.ip });
    return fail(res, 'A valid current TOTP token is required to disable TOTP', 400);
  }

  req.user.totp_enabled = false;
  req.user.totp_secret_encrypted = null;
  req.user.last_totp_step = null;
  clearPendingTotp(req.user);
  await req.user.save();

  logSecurityEvent('totp_disabled', { userId: req.user.id, ip: req.ip });
  return success(res, { totp_enabled: false }, 'TOTP disabled successfully');
}
