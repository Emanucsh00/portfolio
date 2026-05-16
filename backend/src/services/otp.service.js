import bcrypt from 'bcryptjs';

export function generateOtpCode() {
  return `${Math.floor(100000 + Math.random() * 900000)}`;
}

export async function hashOtp(code) {
  return bcrypt.hash(code, 10);
}

export async function compareOtp(code, hash) {
  return bcrypt.compare(code, hash);
}
