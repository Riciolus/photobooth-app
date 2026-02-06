import { app, BrowserWindow, protocol, ipcMain } from "electron";
import path from "path";

import { startFolderWatcher } from "./watcher/folderWatcher";
import { renderStrip } from "./render/stripRenderer";
import { PaperSession } from "./domain/PaperSession";
import { StripTemplate } from "../shared/types";

let win: BrowserWindow | null = null;
let paperSession: PaperSession | null = null;

const WATCHED_FOLDER = "/home/riciolus/Pictures/Camera";

function createWindow() {
  win = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, "index.js"),
    },
    autoHideMenuBar: true,
  });

  win.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL!);
}

app.whenReady().then(() => {
  // ✅ custom protocol for strip:// preview
  protocol.registerFileProtocol("strip", (request, callback) => {
    const filePath = decodeURI(request.url.replace("strip://", ""));
    callback({ path: filePath });
  });

  createWindow();

  // ============================
  // IPC: START SESSION (FROM UI)
  // ============================
  ipcMain.on("start-session", (_, template: StripTemplate) => {
    console.log("🟢 start-session received");
    console.log("📦 TEMPLATE RECEIVED", template);

    paperSession = new PaperSession(template, 5);

    const current = paperSession.getCurrentSession();
    if (!current || !win) return;

    // 🔥 send initial state to unblock UI
    win.webContents.send("session-updated", {
      stage: current.getStage(),
      photos: 0,
      strips: [],
    });
  });

  // ============================
  // FOLDER WATCHER
  // ============================
  startFolderWatcher(WATCHED_FOLDER, async (photoPath) => {
    if (!paperSession || !win) return;

    paperSession.addPhoto(photoPath);

    const current = paperSession.getCurrentSession();
    if (!current) return;

    // update UI
    win.webContents.send("photo-added", { path: photoPath });

    if (!current.isReady()) return;

    const stripIndex = paperSession.getCompletedStrips().length + 1;
    const STRIP_PATH = path.join(app.getAppPath(), `public/strip_${stripIndex}.png`);

    // 🔒 COMMIT AFTER RENDER
    paperSession.completeCurrentSession(STRIP_PATH);

    win.webContents.send("strip-ready", {
      index: stripIndex,
      path: STRIP_PATH,
    });
  });
});
