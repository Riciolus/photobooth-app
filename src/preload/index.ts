import { contextBridge, ipcRenderer } from "electron";
import { ExportPaperPayload } from "src/shared/render";
import { StripTemplate } from "src/shared/types";

contextBridge.exposeInMainWorld("api", {
  startSession: (template: StripTemplate) =>
    ipcRenderer.send("start-session", template),

  onSessionUpdated: (callback: (state: any) => void) => {
    ipcRenderer.on("session-updated", (_e, state) => {
      callback(state);
    });
  },

  pickBackground: () => ipcRenderer.invoke("pick-background"),

  onStripReady: (cb: (strip: { index: number; path: string }) => void) =>
    ipcRenderer.on("strip-ready", (_e, data) => cb(data)),

  onPhotoAdded: (cb: (path: string) => void) =>
    ipcRenderer.on("photo-added", (_, data) => cb(data)),

  pickPhoto: () => ipcRenderer.invoke("pick-photo"),

  exportPaper: (data: ExportPaperPayload) => ipcRenderer.send("export-paper", data),
});
