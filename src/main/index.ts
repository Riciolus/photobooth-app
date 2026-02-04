import { app, BrowserWindow } from "electron";
import path from "path";
import { startFolderWatcher } from "./watcher/folderWatcher";
import { renderStrip } from "./render/stripRenderer";
import { Session } from "./domain/session";
import { CLASSIC_3_TEMPLATE } from "./templates/classic-3";
import { renderPaper } from "./render/paperRenderer";
import { A4_5_STRIPS } from "./templates/paper-a4-5";

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

  const WATCHED_FOLDER = "/home/riciolus/Pictures/camera";
  const STRIP_PATH = path.join(app.getAppPath(), "public/strip.png");
  const PAPER_PATH = path.join(app.getAppPath(), "public/paper.png");

  startFolderWatcher(WATCHED_FOLDER, async (photoPath) => {
    if (!session || session.isReady()) {
      session = new Session(CLASSIC_3_TEMPLATE);
    }

    // 🔒 SESSION DIAMANKAN
    const currentSession = session;

    currentSession.addPhoto(photoPath);

    win.webContents.send("session-updated", {
      stage: currentSession.getStage(),
      photos: currentSession.getPhotos().length,
    });

    if (currentSession.isReady()) {
      await renderStrip({
        template: CLASSIC_3_TEMPLATE,
        photos: currentSession.getPhotos(),
        outputPath: STRIP_PATH,
      });

      await renderPaper({
        paper: A4_5_STRIPS,
        stripPath: STRIP_PATH,
        outputPath: PAPER_PATH,
      });

      win.webContents.send("strip-ready");
    }
  });
});
