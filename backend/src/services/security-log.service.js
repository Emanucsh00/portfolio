function sanitizeMeta(meta = {}) {
  const next = { ...meta };

  delete next.otp;
  delete next.token;
  delete next.secret;
  delete next.password;
  delete next.firebaseToken;

  return next;
}

export function logSecurityEvent(event, meta = {}) {
  const payload = sanitizeMeta(meta);
  console.info(`[SECURITY] ${event}`, payload);
}
