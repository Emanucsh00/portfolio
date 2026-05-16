import jwt from 'jsonwebtoken';

export function signAuthToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      uid: user.firebase_uid,
      email: user.email,
      role: user.role,
      type: 'auth'
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
  );
}

export function signSetupToken(user, challengeToken) {
  return jwt.sign(
    {
      sub: user.id,
      uid: user.firebase_uid,
      email: user.email,
      role: user.role,
      challengeToken,
      type: 'totp_setup'
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_SETUP_EXPIRES_IN || '15m' }
  );
}

export function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}
