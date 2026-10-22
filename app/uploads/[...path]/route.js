import { readFile, stat } from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';

const UPLOAD_ROOT = path.join(process.cwd(), 'public', 'uploads');

const CONTENT_TYPES = {
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.pdf': 'application/pdf'
};

export async function GET(request, { params }) {
  const { path: segments } = await params;
  const requested = path.join(UPLOAD_ROOT, ...segments);

  if (!requested.startsWith(UPLOAD_ROOT + path.sep)) {
    return new NextResponse('Not found', { status: 404 });
  }

  const contentType = CONTENT_TYPES[path.extname(requested).toLowerCase()];
  if (!contentType) {
    return new NextResponse('Not found', { status: 404 });
  }

  try {
    const info = await stat(requested);
    if (!info.isFile()) throw new Error('Not a file');
    const file = await readFile(requested);
    return new NextResponse(file, {
      headers: {
        'Content-Type': contentType,
        'Content-Length': String(file.length),
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
  } catch {
    return new NextResponse('Not found', { status: 404 });
  }
}