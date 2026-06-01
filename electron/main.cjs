const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

const ROOT = path.resolve(__dirname, "..");
const DIST_INDEX = path.join(ROOT, "frontend", "dist", "index.html");
const LOG_DIR = path.join(ROOT, "logs");
const LOG_FILE = path.join(LOG_DIR, "runtime.log");

function log(channel, type, payload = {}) {
  if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });
  fs.appendFileSync(LOG_FILE, JSON.stringify({
    time: new Date().toISOString(),
    channel,
    type,
    payload
  }) + "\n", "utf8");
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1100,
    minHeight: 720,
    backgroundColor: "#050816",
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.once("ready-to-show", () => win.show());

  if (fs.existsSync(DIST_INDEX)) {
    win.loadFile(DIST_INDEX);
  } else {
    win.loadURL("data:text/html;charset=utf-8," + encodeURIComponent(`
      <body style="background:#050816;color:white;font-family:Arial;padding:40px">
        <h1>Universal Arranger OS</h1>
        <h2>Build missing</h2>
        <p>Run: cd frontend && npm run build</p>
      </body>
    `));
  }
}

app.whenReady().then(() => {
  ipcMain.handle("uaos:log", (_event, channel, type, payload) => {
    log(channel, type, payload);
    return { ok: true };
  });

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

process.on("uncaughtException", (error) => {
  log("electron", "uncaughtException", {
    message: error.message,
    stack: error.stack
  });
});

process.on("unhandledRejection", (reason) => {
  log("electron", "unhandledRejection", {
    reason: String(reason)
  });
});
