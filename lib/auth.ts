/* eslint-disable @typescript-eslint/no-explicit-any */
let maybeAuthOptions: unknown = null;

(async () => {
  try {
    const mod = await import('../app/api/auth/[...nextauth]/route');
    maybeAuthOptions = (mod as any).authOptions;
  } catch {
    maybeAuthOptions = null;
  }
})();

export async function getServerAuthSession(req?: any, res?: any) {
  if (!maybeAuthOptions) return null;
  const { getServerSession } = await import('next-auth/next');
  return await getServerSession(req, res, maybeAuthOptions as any);
}

export default getServerAuthSession;
