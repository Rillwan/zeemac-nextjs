import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { SESSION_COOKIE } from '@/lib/auth';

async function hasValidSession(request) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Admin pages, except the login page itself
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!(await hasValidSession(request))) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Admin-only API mutations (reads stay public where relevant, e.g. GET /api/products)
  const adminApiPrefixes = ['/api/products', '/api/categories', '/api/brands', '/api/upload'];
  const isMutatingMethod = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method);
  const isProtectedApiMutation = adminApiPrefixes.some((p) => pathname.startsWith(p)) && isMutatingMethod;

  if (isProtectedApiMutation) {
    if (!(await hasValidSession(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/products/:path*', '/api/categories/:path*', '/api/brands/:path*', '/api/upload/:path*', '/api/site-content/:path*']
};
