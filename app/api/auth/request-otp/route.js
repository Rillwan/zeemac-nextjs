import { NextResponse } from 'next/server';
import { isValidEmail } from '@/lib/validators';
import { checkOtpRateLimit } from '@/lib/rateLimit';
import { createOtp } from '@/lib/otp';
import { sendOtpEmail } from '@/lib/mailer';

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const email = (body?.email || '').trim().toLowerCase();

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Enter a valid email address' }, { status: 400 });
  }

  const adminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();

  // Always respond the same way whether or not the email matches the
  // configured admin, so this endpoint can't be used to discover the
  // admin's email address.
  if (!adminEmail || email !== adminEmail) {
    return NextResponse.json({ ok: true, message: 'If this email is registered, a code has been sent.' });
  }

  const rateLimit = await checkOtpRateLimit(email);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: `Too many requests. Try again in ${Math.ceil(rateLimit.retryAfterSeconds / 60)} minute(s).` },
      { status: 429 }
    );
  }

  const otp = await createOtp(email);
  const result = await sendOtpEmail(email, otp);

  return NextResponse.json({
    ok: true,
    message: 'If this email is registered, a code has been sent.',
  });
}
