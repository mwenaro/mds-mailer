/* eslint-disable @typescript-eslint/no-explicit-any */
// Helper to get server-side auth session.
// The app uses Clerk for client authentication. If you want server-side
// verification for API routes, import Clerk's server helpers from
// `@clerk/nextjs/server` and implement verification here.

export async function getServerAuthSession(req?: any, res?: any) {
  // Placeholder: no server session by default.
  // Example implementation (uncomment when ready and install @clerk/nextjs):
  // const { getAuth } = await import('@clerk/nextjs/server');
  // const auth = getAuth(req as any);
  // return auth.userId ? { userId: auth.userId } : null;
  return null;
}

export default getServerAuthSession;
