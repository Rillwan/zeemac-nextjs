import nodemailer from 'nodemailer';

let cachedTransporter = null;

function isSmtpConfigured() {
  return Boolean(
    process.env.SMTP_HOST &&
    process.env.SMTP_PORT &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS &&
    !process.env.SMTP_HOST.includes('example')
  );
}

function getTransporter() {
  if (cachedTransporter) return cachedTransporter;
  cachedTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
  return cachedTransporter;
}

export async function sendOtpEmail(email, otp) {
  const subject = 'Your Zeemac Filters admin login code';
  const text = `Your login code is ${otp}. It expires in 10 minutes. If you didn't request this, you can ignore this email.`;
  const html = `
    <div style="font-family:sans-serif;max-width:420px;margin:0 auto;padding:24px">
      <h2 style="color:#0E2A52">Zeemac Filters Admin</h2>
      <p>Your login code is:</p>
      <p style="font-size:32px;font-weight:800;letter-spacing:6px;color:#1E63D6">${otp}</p>
      <p style="color:#8896AC;font-size:13px">This code expires in 10 minutes. If you didn't request this, you can ignore this email.</p>
    </div>
  `;

  if (!isSmtpConfigured()) {
    // SMTP not set up yet — log to the server console so the OTP flow
    // can still be tested end-to-end. Replace SMTP_* in .env with real
    // credentials to actually deliver email.
    console.log(`\n[DEV] OTP for ${email}: ${otp} (SMTP not configured — see .env)\n`);
    return { delivered: false, devOtp: otp };
  }

  const transporter = getTransporter();
  await transporter.sendMail({
    from: process.env.SMTP_FROM || `"Zeemac Filters" <${process.env.SMTP_USER}>`,
    to: email,
    subject,
    text,
    html
  });

  return { delivered: true };
}
