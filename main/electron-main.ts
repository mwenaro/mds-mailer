import { app, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { format as formatUrl } from 'url';
import fs from 'fs';

const isDev = process.env.NODE_ENV !== 'production';

function createWindow() {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
    },
  });

  const startUrl = process.env.ELECTRON_START_URL;

  if (isDev || startUrl) {
    const url = startUrl || 'http://localhost:3000';
    win.loadURL(url);
  } else {
    // Look for static export 'out/index.html' first
    const outIndex = join(__dirname, '../out/index.html');
    if (fs.existsSync(outIndex)) {
      win.loadURL(formatUrl({ pathname: outIndex, protocol: 'file:', slashes: true }));
    } else {
      // Fallback to a packaged renderer (e.g., packaged files in resources)
      const indexPath = join(process.resourcesPath, 'app', 'out', 'index.html');
      if (fs.existsSync(indexPath)) {
        win.loadURL(formatUrl({ pathname: indexPath, protocol: 'file:', slashes: true }));
      } else {
        // No static file found — inform the developer
        win.loadURL('about:blank');
      }
    }
  }

  return win;
}

app.on('ready', () => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// Example IPC handler if needed
ipcMain.handle('ping', async () => {
  return 'pong';
});
