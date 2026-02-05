import { contextBridge, ipcRenderer } from "electron";
import { StripTemplate } from "src/shared/types";

console.log("🔥 PRELOAD LOADED");

contextBridge.exposeInMainWorld("api", {
  startSession: (template: StripTemplate) =>
    ipcRenderer.send("start-session", template),

  onSessionUpdated: (callback: (state: any) => void) => {
    ipcRenderer.on("session-updated", (_e, state) => {
      callback(state);
    });
  },

  onStripReady: (cb: (strip: { index: number; path: string }) => void) =>
    ipcRenderer.on("strip-ready", (_e, data) => cb(data)),

  onPhotoAdded: (cb: (path: string) => void) =>
    ipcRenderer.on("photo-added", (_, data) => cb(data)),
});
