import nodemailer from 'nodemailer';

let transporter;

function getTransporter() {
  if (transporter) return transporter;

  const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS } = process.env;
  const port = Number(SMTP_PORT || 587);
  const secure = SMTP_SECURE !== undefined ? SMTP_SECURE === 'true' : port === 465;

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure,
    connectionTimeout: 30000,
    greetingTimeout: 30000,
    auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined
  });

  return transporter;
}

export async function sendOtpEmail({ to, code, name }) {
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 24px; background: #f7faf8; color: #152d35;">
      <h2 style="margin-top: 0;">Verificación de acceso</h2>
      <p>Hola ${name || 'usuario'}, este es tu código OTP temporal para continuar el acceso al panel.</p>
      <div style="font-size: 32px; letter-spacing: 6px; font-weight: 700; margin: 24px 0; color: #2c6e7f;">
        ${code}
      </div>
      <p>El código expira en 5 minutos. Si no solicitaste este acceso, ignora este correo.</p>
    </div>
  `;

  try {
    return await getTransporter().sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject: 'Codigo OTP de acceso al portafolio',
      html
    });
  } catch (err) {
    throw new Error(`Email delivery failed: ${err.message}`);
  }
}
