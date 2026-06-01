const {
  app,
  BrowserWindow
} = require("electron");

function createWindow() {

  const window =
    new BrowserWindow({

      width: 1400,
      height: 900,

      webPreferences: {
        nodeIntegration: true,
      }
    });

  window.loadURL(
    "http://localhost:5173"
  );
}

app.whenReady().then(
  createWindow
);
