import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

export const OTP_TTL_MINUTES = 10;
export const MAX_VERIFY_ATTEMPTS = 5;

function getPepper() {
  const pepper = process.env.OTP_PEPPER || process.env.JWT_SECRET;
  if (!pepper) throw new Error('OTP_PEPPER (or JWT_SECRET) is not set in the environment');
  return pepper;
}

function generateOtp() {
  // 6-digit numeric code, zero-padded
  return crypto.randomInt(0, 1_000_000).toString().padStart(6, '0');
}

function hashOtp(otp, email) {
  return crypto.createHmac('sha256', getPepper()).update(`${email}:${otp}`).digest('hex');
}

/**
 * Creates a new OTP request row for the given email and returns the
 * plaintext OTP so the caller can email it. Only the hash is stored.
 */
export async function createOtp(email) {
  const otp = generateOtp();
  const otpHash = hashOtp(otp, email);
  const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

  await prisma.otpRequest.create({
    data: { email, otpHash, expiresAt }
  });

  return otp;
}

/**
 * Verifies a submitted OTP against the most recent, unexpired request
 * for that email. Returns { ok: true } or { ok: false, reason }.
 */
export async function verifyOtp(email, submittedOtp) {
  const latest = await prisma.otpRequest.findFirst({
    where: { email, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: 'desc' }
  });

  if (!latest) {
    return { ok: false, reason: 'expired' };
  }

  if (latest.attempts >= MAX_VERIFY_ATTEMPTS) {
    return { ok: false, reason: 'too_many_attempts' };
  }

  const submittedHash = hashOtp(submittedOtp, email);
  const matches = crypto.timingSafeEqual(
    Buffer.from(submittedHash, 'hex'),
    Buffer.from(latest.otpHash, 'hex')
  );

  if (!matches) {
    await prisma.otpRequest.update({
      where: { id: latest.id },
      data: { attempts: { increment: 1 } }
    });
    return { ok: false, reason: 'incorrect' };
  }

  // Success — remove this and any other outstanding OTPs for the email
  // so a used/old code can never be replayed.
  await prisma.otpRequest.deleteMany({ where: { email } });

  return { ok: true };
}
