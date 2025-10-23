// NextAuth has been removed from this project and replaced with Clerk.
// This route remains as a harmless stub to avoid build-time module resolution
// errors from previous builds. If you want to re-enable auth routes, replace
// this stub with your Clerk-backed API or remove the file and implement your
// auth endpoints elsewhere.

export async function GET() {
  return new Response('Not Found', { status: 404 });
}

export async function POST() {
  return new Response('Not Found', { status: 404 });
}
