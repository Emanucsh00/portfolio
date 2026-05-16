const requiredEnv = [
  'JWT_SECRET',
  'CRYPTO_SECRET',
  'CORS_ORIGIN',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_CLIENT_EMAIL',
  'FIREBASE_PRIVATE_KEY',
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_FROM'
];

export function validateEnv() {
  const missing = requiredEnv.filter((key) => !process.env[key]);

  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  if (process.env.CORS_ORIGIN.includes('*')) {
    throw new Error('CORS_ORIGIN cannot use wildcard origins in this project');
  }
}

export function getBooleanEnv(key, fallback = false) {
  const value = process.env[key];

  if (typeof value === 'undefined') {
    return fallback;
  }

  return value === 'true';
}

export function getNumberEnv(key, fallback) {
  const value = process.env[key];

  if (typeof value === 'undefined' || value === '') {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}
