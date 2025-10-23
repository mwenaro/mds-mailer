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
