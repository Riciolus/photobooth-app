import { app, BrowserWindow } from "electron"
import path from "path"

import { startFolderWatcher } from "./watcher/folderWatcher"
import { renderStrip } from "./render/stripRenderer"
import { Session } from "./domain/session"
import { CLASSIC_3_TEMPLATE } from "./templates/classic-3"

const WATCHED_FOLDER = "/home/riciolus/Pictures/camera"
const OUTPUT_PATH = "/home/riciolus/Pictures/output/strip.png"

function createWindow(): BrowserWindow {
  const win = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, "index.js"),
    },
  })

  win.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL!)
  return win
}

app.whenReady().then(() => {
  const mainWindow = createWindow()

  let session: Session | null = null

  startFolderWatcher(WATCHED_FOLDER, async (photoPath) => {
    if (!session || session.isReady()) {
      session = new Session(CLASSIC_3_TEMPLATE)
    }

    session.addPhoto(photoPath)

    if (session.isReady()) {
      await renderStrip({
        template: CLASSIC_3_TEMPLATE,
        photos: session.getPhotos(),
        outputPath: OUTPUT_PATH,
      })

      mainWindow.webContents.send("strip-ready", {
      path: OUTPUT_PATH,
    }  )


      console.log("🖨 Strip rendered:", OUTPUT_PATH)
    }

    mainWindow.webContents.send("session-updated", {
      stage: session.getStage(),
      photos: session.getPhotos().length,
    })
  })
})
