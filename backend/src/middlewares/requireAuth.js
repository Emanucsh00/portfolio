import { User } from '../models/index.js';
import { getBooleanEnv } from '../config/env.js';
import { assertFirebaseUserActive } from '../config/firebase.js';
import { verifyToken } from '../services/jwt.service.js';
import { fail } from '../utils/response.js';

function readBearerToken(req) {
  const header = req.headers.authorization || '';
  return header.startsWith('Bearer ') ? header.slice(7) : null;
}

async function resolveUserFromPayload(payload) {
  const user = await User.findByPk(payload.sub);

  if (!user || user.status !== 'active' || user.firebase_uid !== payload.uid) {
    return null;
  }

  if (getBooleanEnv('AUTH_CHECK_FIREBASE_REVOKED', false)) {
    try {
      await assertFirebaseUserActive(payload.uid);
    } catch (error) {
      return null;
    }
  }

  return user;
}

export async function requireAuth(req, res, next) {
  try {
    const token = readBearerToken(req);

    if (!token) {
      return fail(res, 'Authentication token is required', 401);
    }

    const payload = verifyToken(token);

    if (payload.type !== 'auth') {
      return fail(res, 'Invalid auth token type', 401);
    }

    const user = await resolveUserFromPayload(payload);

    if (!user) {
      return fail(res, 'User not available', 401);
    }

    req.auth = payload;
    req.user = user;
    return next();
  } catch (error) {
    return fail(res, 'Invalid or expired token', 401);
  }
}

export async function requireSetupToken(req, res, next) {
  try {
    const token = readBearerToken(req);

    if (!token) {
      return fail(res, 'Setup token is required', 401);
    }

    const payload = verifyToken(token);

    if (payload.type !== 'totp_setup') {
      return fail(res, 'Invalid setup token type', 401);
    }

    const user = await resolveUserFromPayload(payload);

    if (!user) {
      return fail(res, 'User not available', 401);
    }

    req.auth = payload;
    req.user = user;
    return next();
  } catch (error) {
    return fail(res, 'Invalid or expired setup token', 401);
  }
}

export async function requireAuthOrSetupToken(req, res, next) {
  try {
    const token = readBearerToken(req);

    if (!token) {
      return fail(res, 'Authentication token is required', 401);
    }

    const payload = verifyToken(token);
    if (!['auth', 'totp_setup'].includes(payload.type)) {
      return fail(res, 'Invalid token type', 401);
    }

    const user = await resolveUserFromPayload(payload);
    if (!user) {
      return fail(res, 'User not available', 401);
    }

    req.auth = payload;
    req.user = user;
    return next();
  } catch (error) {
    return fail(res, 'Invalid or expired token', 401);
  }
}
