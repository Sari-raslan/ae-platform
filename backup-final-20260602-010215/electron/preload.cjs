const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("uaos", {
  ready: true,
  version: "3.5.0",
  channel: "stable"
});
