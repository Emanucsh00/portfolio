import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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

  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM || 'Portfolio <onboarding@resend.dev>',
    to,
    subject: 'Codigo OTP de acceso al portafolio',
    html
  });

  if (error) {
    console.error('[email] Resend error:', error.message, error.name);
    throw new Error(`Email delivery failed: ${error.message}`);
  }
}
