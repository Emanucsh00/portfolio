import crypto from 'crypto';

const algorithm = 'aes-256-cbc';
const secret = process.env.CRYPTO_SECRET || 'fallback_crypto_secret_change_me';
const key = crypto.createHash('sha256').update(secret).digest();

export function encrypt(value) {
  if (!value) {
    return null;
  }

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

export function decrypt(value) {
  if (!value) {
    return null;
  }

  const [ivHex, encryptedHex] = value.split(':');
  const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(ivHex, 'hex'));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedHex, 'hex')),
    decipher.final()
  ]);
  return decrypted.toString('utf8');
}

export function hmac(value) {
  return crypto.createHmac('sha256', secret).update(String(value)).digest('hex');
}
