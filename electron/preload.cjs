const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("uaos", {
  ping: () => Promise.resolve({ ok: true }),
  health: () => Promise.resolve({ ok: true })
});
