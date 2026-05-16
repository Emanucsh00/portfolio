import nodemailer from 'nodemailer';

let transporter;

function getTransporter() {
  if (transporter) {
    return transporter;
  }

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: process.env.SMTP_USER
      ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      : undefined
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

  return getTransporter().sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: 'Codigo OTP de acceso al portafolio',
    html
  });
}
