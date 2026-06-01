const {
  app,
  BrowserWindow
} = require("electron");

const path = require("path");

const fs = require("fs");

const ROOT = path.resolve(__dirname, "..");

const DIST_INDEX = path.join(
  ROOT,
  "frontend",
  "dist",
  "index.html"
);

function createWindow(){

  const win = new BrowserWindow({

    width:1600,

    height:900,

    backgroundColor:"#050816",

    webPreferences: {

      preload: path.join(
        __dirname,
        "preload.cjs"
      ),

      contextIsolation: true,

      nodeIntegration: false
    }
  });

  if(fs.existsSync(DIST_INDEX)){

    win.loadFile(DIST_INDEX);

  } else {

    win.loadURL(
      "data:text/html;charset=utf-8," +
      encodeURIComponent(`
        <body style="background:#050816;color:white;font-family:Arial;padding:40px">
          <h1>Universal Arranger OS</h1>
          <h2>Frontend Build Missing</h2>
        </body>
      `)
    );
  }
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {

  if(process.platform !== "darwin"){
    app.quit();
  }
});
