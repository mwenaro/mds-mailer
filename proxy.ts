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

// Helper to require a Clerk session in API routes or other server code.
export async function requireClerkSession(req: Request | NextRequest) {
  try {
    const mod = await import('@clerk/nextjs/server');
    const { getAuth } = mod as typeof import('@clerk/nextjs/server');
    // getAuth accepts a Request-like object; build a minimal shape if needed
    const hasNextUrl = typeof req === 'object' && req !== null && 'nextUrl' in req;
    const requestLike = hasNextUrl ? (req as NextRequest) : { headers: (req as Request).headers };
    // getAuth expects a RequestLike; use a narrow cast and suppress the explicit-any lint rule
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const auth = getAuth(requestLike as any);
    if (!auth || !auth.userId) return null;
    return { userId: auth.userId, sessionId: auth.sessionId ?? null, orgId: auth.orgId ?? null };
  } catch (_err) {
    return null;
  }
}
