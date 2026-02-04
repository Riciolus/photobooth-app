import { app, BrowserWindow, protocol } from "electron";
import path from "path";
import { startFolderWatcher } from "./watcher/folderWatcher";
import { renderStrip } from "./render/stripRenderer";
import { Session } from "./domain/session";
import { renderPaper } from "./render/paperRenderer";
import { PaperSession } from "./domain/PaperSession";
import { INTERNS_FAREWELL_TEMPLATE } from "./templates/interns-farewell";

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
  protocol.registerFileProtocol("strip", (request, callback) => {
    const filePath = decodeURI(request.url.replace("strip://", ""));
    callback({ path: filePath });
  });

  const win = createWindow();
  const paperSession = new PaperSession(INTERNS_FAREWELL_TEMPLATE, 5);
  let session: Session | null = null;

  const WATCHED_FOLDER = "/home/riciolus/Pictures/camera";

  const PAPER_PATH = path.join(app.getAppPath(), "public/paper.png");

  startFolderWatcher(WATCHED_FOLDER, async (photoPath) => {
    // 1️⃣ foto masuk
    paperSession.addPhoto(photoPath);

    const currentSession = paperSession.getCurrentSession();
    if (!currentSession) return;

    // 2️⃣ update UI (collecting)
    win.webContents.send("session-updated", {
      stage: currentSession.getStage(),
      photos: currentSession.getPhotos().length,
    });

    // 3️⃣ kalau strip READY
    if (currentSession.isReady()) {
      const stripIndex = paperSession.getCompletedStrips().length + 1;
      const STRIP_PATH = path.join(
        app.getAppPath(),
        `public/strip_${stripIndex}.png`
      );

      await renderStrip({
        template: currentSession.getTemplate(),
        photos: currentSession.getPhotos(),
        outputPath: STRIP_PATH,
      });

      // 4️⃣ commit strip ke PaperSession
      paperSession.completeCurrentSession(STRIP_PATH);

      // 5️⃣ notify UI strip slot
      win.webContents.send("strip-ready", {
        index: stripIndex,
        path: STRIP_PATH,
      });
    }
  });
});
