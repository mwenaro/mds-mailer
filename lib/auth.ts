// Server-side auth helpers for Clerk.
// getServerAuthSession dynamically imports Clerk's server helpers so this
// file doesn't hard-fail if Clerk isn't installed during static analysis.
// It returns a small, portable auth shape or null when unauthenticated.

export async function getServerAuthSession(req?: Request | unknown) {
  try {
    const mod = await import('@clerk/nextjs/server');
    // getAuth accepts NextRequest, Node Request, or an object with headers.
    const { getAuth } = mod as typeof import('@clerk/nextjs/server');
    // Normalize headers/cookies into plain objects to avoid DOM Request init issues
  type RequestLike = { headers?: Record<string, string>; cookies?: Record<string, string> } | Request;
  let requestLike: RequestLike = (req as RequestLike) ?? {};
    try {
      if (req && typeof req === 'object') {
        const headersObj: Record<string, string> = {};
        // support NextRequest or Web Request
        const r = req as Record<string, unknown>;
        if (r.headers && typeof (r.headers as { entries?: unknown }).entries === 'function') {
          const entries = (r.headers as { entries: () => IterableIterator<[string, unknown]> }).entries();
          for (const [k, v] of entries) {
            headersObj[String(k)] = String(v);
          }
        } else if (r.headers && typeof r.headers === 'object') {
          const h = r.headers as Record<string, unknown>;
          for (const k of Object.keys(h)) headersObj[k] = String(h[k] ?? '');
        }

        const cookiesObj: Record<string, string> = {};
        if (r.cookies && typeof (r.cookies as { entries?: unknown }).entries === 'function') {
          const entries = (r.cookies as { entries: () => IterableIterator<[string, unknown]> }).entries();
          for (const [k, v] of entries) {
            // cookie values may be { value: string } or plain string
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
      // fallback to original req
      requestLike = req as RequestLike;
    }

  // Call getAuth. Clerk's RequestLike type is from the Clerk package; at runtime
  // a plain object or Request works. Cast via any and keep this a single-line
  // exception for the runtime call.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const auth = getAuth(requestLike as unknown as any);
    if (!auth || !auth.userId) return null;
    return {
      userId: auth.userId,
      sessionId: auth.sessionId ?? null,
      orgId: auth.orgId ?? null,
      claims: (auth as unknown as Record<string, unknown>)['claims'] ?? null,
    };
  } catch {
    // Clerk not available or runtime error — treat as unauthenticated.
    return null;
  }
}

export default getServerAuthSession;
