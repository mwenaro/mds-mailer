#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
// Simple Express server to serve an exported Next.js 'out' or a static 'out' folder.
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

const outDir = path.join(process.cwd(), 'out');
const nextDir = path.join(process.cwd(), '.next', 'server', 'pages');

if (fs.existsSync(outDir)) {
  app.use(express.static(outDir));
  app.get('*', (req, res) => res.sendFile(path.join(outDir, 'index.html')));
} else if (fs.existsSync(nextDir)) {
  app.use(express.static(nextDir));
  app.get('*', (req, res) => res.sendFile(path.join(nextDir, 'index.html')));
} else {
  console.error('No export found to serve. Run `next build && next export` or provide a production build.');
  process.exit(1);
}

app.listen(port, () => {
  console.log(`Static server running at http://localhost:${port}`);
});
