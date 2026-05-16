import QRCode from 'qrcode';
import speakeasy from 'speakeasy';
import { decrypt, encrypt } from '../utils/crypto.js';

export function generateTotpSecret(email) {
  return speakeasy.generateSecret({
    name: `Portfolio (${email})`,
    issuer: 'Portfolio Fullstack',
    length: 20
  });
}

export async function buildTotpSetupPayload(secret) {
  const qrCodeDataUrl = await QRCode.toDataURL(secret.otpauth_url);

  return {
    otpauthUrl: secret.otpauth_url,
    qrCodeDataUrl
  };
}

export function verifyTotpToken({ secret, token }) {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 1
  });
}

export function getTotpStep() {
  return Math.floor(Date.now() / 30000);
}

export function encryptTotpSecret(secret) {
  return encrypt(secret);
}

export function decryptTotpSecret(secret) {
  return decrypt(secret);
}
