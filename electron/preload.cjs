const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("UniversalArrangerOS", {
  desktopRuntime: true,
  platform: process.platform
});
