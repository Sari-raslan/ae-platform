const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("uaos", {
  ping: () => Promise.resolve({ ok: true }),
  health: () => Promise.resolve({ ok: true }),
  log: (channel, type, payload = {}) =>
    ipcRenderer.invoke("uaos:log", channel, type, payload)
});
