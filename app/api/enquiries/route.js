import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { getSettings } from '@/lib/settings';
import { sendEnquiryEmail } from '@/lib/mailer';
import { ENQUIRY_TOPICS } from '@/lib/contact';

const MAX_PER_HOUR = 5;

function clean(value, max) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  // Hidden field that real visitors never fill in: pretend success and store nothing
  if (typeof body.website === 'string' && body.website.trim()) {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  const name = clean(body.name, 100);
  const company = clean(body.company, 120);
  const phone = clean(body.phone, 30);
  const email = clean(body.email, 120);
  const message = clean(body.message, 2000);
  const topic = ENQUIRY_TOPICS.some((t) => t.value === body.topic) ? body.topic : 'other';

  if (name.length < 2) {
    return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 });
  }
  if (!phone && !email) {
    return NextResponse.json({ error: 'Please enter a phone number or an email address.' }, { status: 400 });
  }
  if (phone && !/^[+\d][\d\s()\-]{5,}$/.test(phone)) {
    return NextResponse.json({ error: 'Please enter a valid phone number.' }, { status: 400 });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }
  if (message.length < 5) {
    return NextResponse.json({ error: 'Please tell us a little about your requirement.' }, { status: 400 });
  }

  const forwarded = request.headers.get('x-forwarded-for') || '';
  const ip = forwarded.split(',')[0].trim() || request.headers.get('x-real-ip') || 'unknown';
  const ipHash = crypto.createHash('sha256').update(ip).digest('hex');

  const recent = await prisma.enquiry.count({
    where: { ipHash, createdAt: { gt: new Date(Date.now() - 60 * 60 * 1000) } }
  });
  if (recent >= MAX_PER_HOUR) {
    return NextResponse.json(
      { error: 'Too many enquiries from this connection. Please try again later or contact us on WhatsApp.' },
      { status: 429 }
    );
  }

  const enquiry = await prisma.enquiry.create({
    data: {
      name,
      company: company || null,
      phone: phone || null,
      email: email || null,
      topic,
      message,
      ipHash
    }
  });

  // Email alert (only when SMTP is configured); a mail problem never stops the enquiry from being saved
  const settings = await getSettings();
  const notifyTo = process.env.ENQUIRY_NOTIFY_EMAIL || settings.email;
  sendEnquiryEmail(
    { ...enquiry, topic: ENQUIRY_TOPICS.find((t) => t.value === topic)?.label || topic },
    notifyTo
  ).catch((err) => console.error('Enquiry email failed:', err.message));

  return NextResponse.json({ ok: true, id: enquiry.id }, { status: 201 });
}
