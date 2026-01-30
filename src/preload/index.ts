import { contextBridge, ipcRenderer } from "electron"

console.log("🔥 PRELOAD LOADED")

contextBridge.exposeInMainWorld("api", {
  startSession: () => ipcRenderer.invoke("start-session"),

  onSessionUpdated: (callback: (state: any) => void) => {
    ipcRenderer.on("session-updated", (_e, state) => {
      callback(state)
    })
  },

  // onStripReady: (cb: (path: string) => void) =>
  //   ipcRenderer.on("strip-ready", (_, data) => cb(data.path)),
})
