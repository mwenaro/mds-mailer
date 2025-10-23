# MDS Mailer

MDS Mailer is a small Next.js (App Router) application demonstrating mailbox management with Clerk authentication and MongoDB persistence. It includes a marketing landing page, registration UI, and a dashboard. The project contains tests and CI configuration.

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Create a `.env.local` in the project root with the following environment variables:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
MONGODB_URI=mongodb://localhost:27017/mds-mailer
MAILBOX_ENCRYPTION_KEY=<base64-32-bytes>
```

Generate a 32-bytes base64 key for `MAILBOX_ENCRYPTION_KEY`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

3. Run locally:

```bash
npm run dev
```

4. Run tests:

```bash
npm test
```

## Project Structure

- `app/` — Next.js App Router pages and API routes
- `components/` — UI components (landing sections etc.)
- `lib/` — server helpers:
  - `auth.ts` — server-side Clerk session helper (dynamic import)
  - `db.ts` — MongoDB connection helper (lazy connect)
  - `store.ts` — mailbox persistence (MongoDB-backed)
  - `crypto.ts` — encryption helper for mailbox credentials
- `__tests__/` — Jest + React Testing Library tests
- `.github/workflows/ci.yml` — CI pipeline (lint/build/tests)

## Authentication (Clerk)

This project uses Clerk for authentication. Set your Clerk keys in `.env.local`. The server-side helper `getServerAuthSession` is used in API routes to protect endpoints.

Client-side components use `@clerk/nextjs` (e.g., `SignInButton`, `useUser`) for auth UI.

## Mailbox Storage & Security

- Mailbox credentials are stored encrypted using AES-256-GCM via `lib/crypto.ts`. Provide a `MAILBOX_ENCRYPTION_KEY` (32 bytes, base64) in your environment.
- The API associates mailboxes with a `ownerId` (Clerk user id) and enforces server-side checks — only the authenticated user's mailboxes are returned.
- Important security notes:
  - Do not commit secrets. Use environment variables or a secrets manager for production.
  - Consider using OAuth or delegated access to mail services instead of storing user passwords.
  - Implement key rotation and re-encryption strategy for `MAILBOX_ENCRYPTION_KEY`.

## Testing

- Unit tests use Jest + React Testing Library. Server-side tests mock Clerk and storage to avoid external dependencies.
- Tests are configured in `jest.config.ts`. A JSDOM environment is used for client tests and polyfills are added in `jest.setup.ts`.

## CI / Deployment

- GitHub Actions workflow `ci.yml` runs lint, build, and tests on pushes/PRs to `main`.
- Recommended deployment: Vercel (auto-detects Next.js apps). Set the environment variables in Vercel's dashboard.

## Next tasks / Improvements

- Replace simplistic mailbox credential storage with delegated OAuth where possible.
- Add proper key management and rotation for encryption keys.
- Add integration tests using a test MongoDB instance (mongodb-memory-server) in CI.
- Harden authorization checks and RBAC if supporting organizations or shared mailboxes.

If you'd like, I can push these changes and create a release tag, or add integration tests next.
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## PWA & Electron notes

This project includes optional PWA configuration (via `next-pwa`). To enable the PWA you should install the dependencies:

```bash
npm install next-pwa workbox-core workbox-routing workbox-strategies --save-dev
```

Then run a production build and serve it to test service worker registration:

```bash
npm run build
npm run start
# open http://localhost:3000 and check DevTools > Application > Service Workers
```

Electron dev/build scripts are placeholders; see `instructions.txt` for the full Electron setup steps and add the electron main process files as described there.
