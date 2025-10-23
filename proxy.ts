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
    // Normalize headers/cookies into plain objects to avoid DOM Request init issues
    type RequestLike = { headers?: Record<string, string>; cookies?: Record<string, string> } | Request;
    let requestLike: RequestLike = (req as RequestLike) ?? {};
    try {
      if (req && typeof req === 'object') {
        const r = req as unknown as Record<string, unknown>;
        const headersObj: Record<string, string> = {};
        if (r.headers && typeof (r.headers as { entries?: unknown }).entries === 'function') {
          const entries = (r.headers as { entries: () => IterableIterator<[string, unknown]> }).entries();
          for (const [k, v] of entries) headersObj[String(k)] = String(v ?? '');
        } else if (r.headers && typeof r.headers === 'object') {
          const h = r.headers as Record<string, unknown>;
          for (const k of Object.keys(h)) headersObj[k] = String(h[k] ?? '');
        }

        const cookiesObj: Record<string, string> = {};
        if (r.cookies && typeof (r.cookies as { entries?: unknown }).entries === 'function') {
          const entries = (r.cookies as { entries: () => IterableIterator<[string, unknown]> }).entries();
          for (const [k, v] of entries) {
            if (v && typeof v === 'object' && 'value' in (v as Record<string, unknown>)) {
              cookiesObj[k] = String((v as Record<string, unknown>).value ?? '');
            } else {
              cookiesObj[k] = String(v ?? '');
            }
          }
        } else if (r.cookies && typeof r.cookies === 'object') {
          const c = r.cookies as Record<string, unknown>;
          for (const k of Object.keys(c)) cookiesObj[k] = String(c[k] ?? '');
        }

        requestLike = { headers: headersObj, cookies: cookiesObj };
      }
    } catch {
      requestLike = req as RequestLike;
    }

  // getAuth expects Clerk's RequestLike type; cast via unknown and allow a single-line
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const auth = getAuth(requestLike as unknown as any);
    if (!auth || !auth.userId) return null;
    return { userId: auth.userId, sessionId: auth.sessionId ?? null, orgId: auth.orgId ?? null };
  } catch {
    return null;
  }
}
