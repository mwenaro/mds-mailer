# Deployment and PWA/Auth Guidance

This project uses Next.js (App Router), Clerk for authentication, and TailwindCSS. Below are notes for deploying to Vercel (recommended) and additional guidance for PWA offline behavior and Clerk integration.

## Vercel

- Create a new Vercel project from your GitHub repo. Vercel auto-detects Next.js apps.
- Environment variables to set in Vercel:
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
  - `CLERK_SECRET_KEY`
  - Any DB connection strings (e.g. `MONGODB_URI`) if you replace the demo store.
- Build command: `npm run build`
- Output: Vercel handles the output automatically for Next.js.

## Other Hosts

- For other Node hosts, build with `npm run build` and run `npm start` or use a process manager.
- Ensure environment variables from above are set.

## PWA / Service Worker

- A basic service worker registration helper is included (`components/RegisterSWClient.tsx`).
- For offline-first experiences make sure you:
  - Cache static assets (images, CSS, JS) and basic routes.
  - Keep API calls resilient and fallback to cached responses or show friendly offline UI.

## Clerk Integration Notes

- Clerk requires the publishable key on the client and the secret key on the server.
- Protect API routes by validating sessions server-side (use the existing `lib/auth.ts` helper and `proxy.ts` requireClerkSession).
- For local development add keys to `.env.local`:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

## Troubleshooting

- If builds fail due to stale `.next` cache after changing server auth libraries, delete `.next` and rebuild.
- When migrating auth providers, ensure you remove old server routes referencing the previous provider to avoid module-not-found errors.
# Deployment checklist

This file contains steps and notes for deploying the web app (Next.js) and packaging the Electron desktop builds.

## Web (Vercel)

1. Connect your GitHub repository to Vercel and set the project root.
2. Add the following environment variables in Vercel (Settings > Environment Variables):
  - MONGODB_URI (MongoDB Atlas connection string)
  - DB_NAME
  - NEXT_PUBLIC_CLERK_FRONTEND_API (Clerk frontend API URL)
  - CLERK_API_KEY (server-side Clerk API key, keep secret)
3. Build command: `npm run build`
4. Output directory: leave default (Next.js app router handled by Vercel)
5. Enable automatic deployments from `main` branch.

Notes:
- For Clerk, set `NEXT_PUBLIC_CLERK_FRONTEND_API` and `CLERK_API_KEY` appropriately (see Clerk dashboard).
- For PWA, ensure your service worker is registered in production (see README and manifest.json).

## Desktop (Electron)

1. Build the Next app: `npm run build`.
2. Export or serve the production output. The Electron `main` script will use `ELECTRON_START_URL` in dev; in production it looks for static files under `out/` or packaged resources.
3. Use `npm run electron:build` to run `electron-builder` (configured in `package.json`).
4. Code-signing: for macOS and Windows, sign your builds using the appropriate certificates. This is platform-specific and usually done in CI with secrets.

## HostPinnacle (DNS / Email)

- Set DNS `A` records to point to your host for custom domains.
- If using HostPinnacle for email, configure SPF, DKIM, and DMARC records as recommended by your mail provider.

## PWA + Offline + Auth guidance

- Use `next-pwa` in production to generate `sw.js` (service worker). The app registers this only in production by default.
- Caching strategy recommendations:
  - Static assets and images: Stale-While-Revalidate with a reasonable `maxEntries`.
  - API routes: NetworkFirst to prefer fresh data but fallback to cache when offline.
- Auth in PWAs:
  - Avoid relying on client-side tokens when offline for protected API writes.
  - Cache UI and public pages for offline viewing, but gate sensitive actions behind network checks (`navigator.onLine`) and show an offline notice.

Snippet: simple client hook for auth gating (Clerk)

```ts
import { useUser } from '@clerk/nextjs';
export function useAuthGate() {
  const { isSignedIn } = useUser();
  return {
    isAuthenticated: !!isSignedIn,
    canMutate: !!isSignedIn && navigator.onLine,
  };
}
```

## Copilot helper one-liners

- "Create a Tailwind-styled card component with title, image slot, and action button."
- "Add a settings page under /settings that syncs preferences with localStorage and shows offline sync status."
- "Implement a useImageCache hook that caches images using the Cache API and returns a blob URL."
- "Add an offline notification component that appears when navigator.onLine is false and provides retry actions."
- "Create a CRUD UI for todos that uses /api/todos with optimistic UI updates and error rollbacks."

## Quick local commands

```bash
npm install
npm run dev
npm run build
npm run start
npm run electron:dev
npm run electron:build
```

Reminder: never commit secrets — fill `.env.local` from `.env.local.example` and keep it out of source control.
