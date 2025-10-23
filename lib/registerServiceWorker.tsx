"use client";

export function registerServiceWorker() {
  if (typeof window === "undefined") return;
  if (process.env.NODE_ENV !== "production") return; // only register in production

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      const swUrl = "/sw.js";
      navigator.serviceWorker
            .register(swUrl)
            .then(() => {
              // registration successful
              console.log("Service worker registered");
            })
            .catch(() => {
              // ignore registration errors in dev
                console.error("Service worker registration failed");
            });
    });
  }
}

export default registerServiceWorker;
