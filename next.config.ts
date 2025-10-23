import type { NextConfig } from "next";

// `next-pwa` will be loaded dynamically at runtime only when available.
// The plugin is disabled in development to avoid caching during development.
const isProd = process.env.NODE_ENV === "production";

const runtimeCaching = [
  {
    urlPattern: /\/_next\/static\//,
    handler: "StaleWhileRevalidate",
    options: {
      cacheName: "next-static-resources",
      expiration: {
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      },
    },
  },
  {
    urlPattern: /\/(images|_next)\//,
    handler: "StaleWhileRevalidate",
    options: {
      cacheName: "images-cache",
      expiration: {
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      },
    },
  },
  {
    // Network-first for API routes so users get freshest data when online
    urlPattern: /\/api\//,
    handler: "NetworkFirst",
    options: {
      cacheName: "api-cache",
      networkTimeoutSeconds: 10,
      expiration: {
        maxEntries: 30,
        maxAgeSeconds: 24 * 60 * 60, // 1 day
      },
    },
  },
];

const baseConfig: NextConfig = {
  // any other Next config options go here
};

let nextConfig: NextConfig = baseConfig;

if (isProd) {
  try {
    // Importing next-pwa dynamically so installs are optional until the user adds the package
    /* eslint-disable @typescript-eslint/no-require-imports */
    const withPWA = require('next-pwa')({
      dest: 'public',
      register: true,
      skipWaiting: true,
      runtimeCaching,
      disable: !isProd,
    });

    nextConfig = withPWA(baseConfig);
  } catch {
    // If next-pwa is not installed, continue without PWA features.
  }
}

export default nextConfig;
