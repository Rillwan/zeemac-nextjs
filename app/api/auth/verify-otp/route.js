import { NextResponse } from 'next/server';
import { isValidEmail, isValidOtp } from '@/lib/validators';
import { verifyOtp } from '@/lib/otp';
import { signSessionToken, SESSION_COOKIE, sessionCookieOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const email = (body?.email || '').trim().toLowerCase();
  const otp = (body?.otp || '').trim();

  if (!isValidEmail(email) || !isValidOtp(otp)) {
    return NextResponse.json({ error: 'Enter the 6-digit code' }, { status: 400 });
  }

  const adminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  if (!adminEmail || email !== adminEmail) {
    return NextResponse.json({ error: 'Incorrect code' }, { status: 401 });
  }

  const result = await verifyOtp(email, otp);
  if (!result.ok) {
    const messages = {
      expired: 'Code expired. Request a new one.',
      too_many_attempts: 'Too many incorrect attempts. Request a new code.',
      incorrect: 'Incorrect code.'
    };
    return NextResponse.json({ error: messages[result.reason] || 'Incorrect code' }, { status: 401 });
  }

  const admin = await prisma.adminAuth.upsert({
    where: { email },
    update: {},
    create: { email }
  });

  const token = await signSessionToken({ email: admin.email, tokenVersion: admin.tokenVersion });

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
  return response;
}
