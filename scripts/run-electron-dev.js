#!/usr/bin/env node
// Lightweight helper: wait for localhost:3000 then spawn electron
/* eslint-disable @typescript-eslint/no-require-imports */
const { spawn } = require('child_process');
const waitOn = require('wait-on');

const url = process.env.ELECTRON_START_URL || "http://localhost:3000";

waitOn({ resources: [url], timeout: 60_000 }, (err) => {
  if (err) {
    console.error("Timed out waiting for dev server:", err);
    process.exit(1);
  }

  const electronCmd = process.platform === 'win32' ? 'electron.cmd' : 'electron';
  const child = spawn(electronCmd, ["."] , { stdio: "inherit" });

  child.on("close", (code) => process.exit(code));
});
