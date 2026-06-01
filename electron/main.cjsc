const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

const ROOT = path.resolve(__dirname, "..");

const DIST_INDEX = path.join(
  ROOT,
  "frontend",
  "dist",
  "index.html"
);

const LOG_DIR = path.join(ROOT, "logs");

const LOG_FILE = path.join(
  LOG_DIR,
  "runtime.log"
);

function writeLog(channel,type,payload={}){

  if(!fs.existsSync(LOG_DIR)){
    fs.mkdirSync(LOG_DIR,{recursive:true});
  }

  fs.appendFileSync(
    LOG_FILE,
    JSON.stringify({
      time:new Date().toISOString(),
      channel,
      type,
      payload
    }) + "\n",
    "utf8"
  );
}

function createWindow(){

  const win = new BrowserWindow({

    width:1920,
    height:1080,

    minWidth:1280,
    minHeight:820,

    backgroundColor:"#050816",

    webPreferences:{
      preload:path.join(__dirname,"preload.cjs"),
      contextIsolation:true,
      nodeIntegration:false
    }
  });

  if(fs.existsSync(DIST_INDEX)){

    win.loadFile(DIST_INDEX);

  }else{

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

app.whenReady().then(()=>{

  ipcMain.handle(
    "uaos:log",
    (_event,channel,type,payload)=>{

      writeLog(channel,type,payload);

      return {ok:true};
    }
  );

  createWindow();
});

app.on("window-all-closed",()=>{

  if(process.platform !== "darwin"){
    app.quit();
  }
});

process.on("uncaughtException",(error)=>{

  writeLog(
    "electron",
    "uncaughtException",
    {
      message:error.message,
      stack:error.stack
    }
  );
});

process.on("unhandledRejection",(reason)=>{

  writeLog(
    "electron",
    "unhandledRejection",
    {
      reason:String(reason)
    }
  );
});
