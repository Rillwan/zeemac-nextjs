import { prisma } from '@/lib/prisma';

const WINDOW_MINUTES = 5;
const MAX_REQUESTS = 3;

/**
 * Returns { allowed: true } if the email can request another OTP,
 * otherwise { allowed: false, retryAfterSeconds }.
 */
export async function checkOtpRateLimit(email) {
  const windowStart = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000);

  const recent = await prisma.otpRequest.findMany({
    where: { email, createdAt: { gt: windowStart } },
    orderBy: { createdAt: 'asc' }
  });

  if (recent.length < MAX_REQUESTS) {
    return { allowed: true };
  }

  const oldest = recent[0];
  const retryAt = new Date(oldest.createdAt.getTime() + WINDOW_MINUTES * 60 * 1000);
  const retryAfterSeconds = Math.max(1, Math.ceil((retryAt.getTime() - Date.now()) / 1000));

  return { allowed: false, retryAfterSeconds };
}
