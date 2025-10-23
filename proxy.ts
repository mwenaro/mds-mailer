import { NextRequest, NextResponse } from 'next/server';

// Simple proxy/middleware replacement for app router.
// This file can be used to inspect requests and forward or rewrite as needed.

export function proxy(request: NextRequest) {
  // Example: protect API routes under /api/private
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/api/private')) {
    // Here you would validate a cookie or header (Clerk will set cookies)
    // If unauthenticated, redirect to /signin
    const authHeader = request.headers.get('authorization') || '';
    if (!authHeader && !request.cookies.get('__session')) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/signin';
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*', '/((?!_next/static|_next/image|favicon.ico).*)'],
};
