import { contextBridge, ipcRenderer } from "electron";

console.log("🔥 PRELOAD LOADED");

contextBridge.exposeInMainWorld("api", {
  startSession: () => ipcRenderer.invoke("start-session"),

  onSessionUpdated: (callback: (state: any) => void) => {
    ipcRenderer.on("session-updated", (_e, state) => {
      console.log("📩 session-updated received", state);
      callback(state);
    });
  },

  onStripReady: (cb: (strip: { index: number; path: string }) => void) =>
    ipcRenderer.on("strip-ready", (_e, data) => cb(data)),
});
