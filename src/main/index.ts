import { app, BrowserWindow } from "electron";
import path from "path";
import { startFolderWatcher } from "./watcher/folderWatcher";
import { renderStrip } from "./render/stripRenderer";
import { Session } from "./domain/session";
import { CLASSIC_3_TEMPLATE } from "./templates/classic-3";

function createWindow() {
  const win = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, "index.js"),
    },
  });

  win.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL!);
  return win;
}

app.whenReady().then(() => {
  const win = createWindow();
  let session: Session | null = null;

  const OUTPUT_PATH = path.join(app.getAppPath(), "public/strip.png");

  console.log(OUTPUT_PATH);

  startFolderWatcher("/home/riciolus/Pictures/camera", async (photoPath) => {
    if (!session || session.isReady()) {
      session = new Session(CLASSIC_3_TEMPLATE);
    }

    session.addPhoto(photoPath);

    // 🔥 INI YANG HILANG
    win.webContents.send("session-updated", {
      stage: session.getStage(),
      photos: session.getPhotos().length,
    });

    if (session.isReady()) {
      await renderStrip({
        template: CLASSIC_3_TEMPLATE,
        photos: session.getPhotos(),
        outputPath: OUTPUT_PATH,
      });

      win.webContents.send("strip-ready");
    }
  });
});
