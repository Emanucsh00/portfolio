import crypto from 'crypto';
import { Op } from 'sequelize';
import { getBooleanEnv } from '../config/env.js';
import { LoginChallenge, User } from '../models/index.js';
import { logSecurityEvent } from './security-log.service.js';

const challengeTtlMs = Number(process.env.AUTH_CHALLENGE_TTL_MINUTES || 10) * 60 * 1000;
const otpTtlMs = Number(process.env.AUTH_OTP_TTL_MINUTES || 5) * 60 * 1000;

function securitySecret() {
  return process.env.CRYPTO_SECRET || process.env.JWT_SECRET;
}

export function generateChallengeToken() {
  return crypto.randomBytes(32).toString('hex');
}

export function hashChallengeToken(token) {
  return crypto.createHmac('sha256', securitySecret()).update(token).digest('hex');
}

export function getRequestMeta(req) {
  return {
    ip_address: req.ip || req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown',
    user_agent: String(req.get('user-agent') || 'unknown').slice(0, 500)
  };
}

export async function invalidateOpenChallengesForUser(userId) {
  await LoginChallenge.update(
    { completed: true, expires_at: new Date() },
    {
      where: {
        user_id: userId,
        completed: false
      }
    }
  );
}

export async function createLoginChallenge({ req, userId, emailOtpHash }) {
  const token = generateChallengeToken();
  const challengeTokenHash = hashChallengeToken(token);
  const requestMeta = getRequestMeta(req);

  await invalidateOpenChallengesForUser(userId);

  const challenge = await LoginChallenge.create({
    user_id: userId,
    challenge_token_hash: challengeTokenHash,
    email_otp_hash: emailOtpHash,
    email_otp_expires_at: new Date(Date.now() + otpTtlMs),
    expires_at: new Date(Date.now() + challengeTtlMs),
    resend_count: 0,
    last_resend_at: new Date(),
    ...requestMeta
  });

  return {
    rawToken: token,
    challenge
  };
}

export async function findActiveChallengeByRawToken(challengeToken, req) {
  const requestMeta = getRequestMeta(req);
  const strictIp = getBooleanEnv('AUTH_CHALLENGE_STRICT_IP', false);

  const where = {
    challenge_token_hash: hashChallengeToken(challengeToken),
    completed: false,
    expires_at: {
      [Op.gt]: new Date()
    },
    user_agent: requestMeta.user_agent
  };

  if (strictIp) {
    where.ip_address = requestMeta.ip_address;
  }

  const challenge = await LoginChallenge.findOne({
    where,
    include: [{ model: User, as: 'user' }]
  });

  if (!challenge) {
    return null;
  }

  if (!strictIp && challenge.ip_address !== requestMeta.ip_address) {
    logSecurityEvent('challenge_ip_changed', {
      userId: challenge.user_id,
      previousIp: challenge.ip_address,
      currentIp: requestMeta.ip_address
    });
  }

  return challenge;
}

export function invalidateChallenge(challenge) {
  challenge.completed = true;
  challenge.expires_at = new Date();
  return challenge.save();
}
