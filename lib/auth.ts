/* eslint-disable @typescript-eslint/no-explicit-any */
// Server-side auth helpers for Clerk.
// getServerAuthSession dynamically imports Clerk's server helpers so this
// file doesn't hard-fail if Clerk isn't installed during static analysis.
// It returns a small, portable auth shape or null when unauthenticated.

export async function getServerAuthSession(req?: Request | any, _res?: unknown) {
  try {
    const mod = await import('@clerk/nextjs/server');
    // getAuth accepts NextRequest, Node Request, or an object with headers.
    const { getAuth } = mod as typeof import('@clerk/nextjs/server');
    const auth = getAuth(req as any);
    if (!auth || !auth.userId) return null;
    return {
      userId: auth.userId,
      sessionId: auth.sessionId ?? null,
      orgId: auth.orgId ?? null,
      claims: (auth as unknown as Record<string, unknown>)['claims'] ?? null,
    };
  } catch (_err) {
    // Clerk not available or runtime error — treat as unauthenticated.
    return null;
  }
}

export default getServerAuthSession;
