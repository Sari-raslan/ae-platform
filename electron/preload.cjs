const {
  contextBridge
} = require("electron");

contextBridge.exposeInMainWorld(
  "uaos",
  {
    ready:true
  }
);
