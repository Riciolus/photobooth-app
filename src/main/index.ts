import { app, BrowserWindow, protocol, ipcMain, dialog } from "electron";
import path from "path";

import { startFolderWatcher } from "./watcher/folderWatcher";
import { PaperSession } from "./domain/PaperSession";
import { StripTemplate } from "../shared/types";
import { renderPaper } from "./render/paperRenderer";
import { ExportPaperPayload } from "src/shared/render";
import sharp from "sharp";
import { mkdir, writeFile, readdir, readFile, stat, unlink } from "fs/promises";

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
    // console.log("🟢 start-session received");
    // console.log("📦 TEMPLATE RECEIVED", template);

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

  ipcMain.handle("pick-background", async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ["openFile"],
      filters: [{ name: "Images", extensions: ["png", "jpg", "jpeg"] }],
    });

    if (canceled || filePaths.length === 0) return null;

    const filePath = filePaths[0];
    const metadata = await sharp(filePath).metadata();

    return {
      path: filePath,
      width: metadata.width!,
      height: metadata.height!,
    };
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

  ipcMain.handle("pick-photo", async () => {
    const result = await dialog.showOpenDialog({
      properties: ["openFile"],
      filters: [{ name: "Images", extensions: ["png", "jpg", "jpeg"] }],
    });

    if (result.canceled || result.filePaths.length === 0) return null;

    return {
      path: result.filePaths[0],
    };
  });

  ipcMain.on("export-paper", async (_event, data: ExportPaperPayload) => {
    const { canceled, filePath } = await dialog.showSaveDialog({
      title: "Export Strip Image",
      defaultPath: "photobooth.png",
      filters: [{ name: "PNG Image", extensions: ["png"] }],
    });

    if (canceled || !filePath) return;

    await renderPaper({
      ...data,
      outputPath: filePath,
    });
  });

  async function ensureTemplateDir() {
    const dir = path.join(app.getPath("userData"), "templates");
    await mkdir(dir, { recursive: true });
    return dir;
  }

  const MAX_TEMPLATES = 3;
  ipcMain.handle("template-save", async (_, template: StripTemplate) => {
    try {
      const dir = await ensureTemplateDir();

      const files = (await readdir(dir)).filter((f) => f.endsWith(".json"));

      if (files.length >= MAX_TEMPLATES) {
        const fileStats = await Promise.all(
          files.map(async (file) => {
            const filePath = path.join(dir, file);
            const stats = await stat(filePath);

            return {
              filePath,
              mtime: stats.mtime.getTime(),
            };
          })
        );

        fileStats.sort((a, b) => a.mtime - b.mtime);

        await unlink(fileStats[0].filePath);
      }

      const filePath = path.join(dir, `${template.id}.json`);

      await writeFile(filePath, JSON.stringify(template, null, 2), "utf-8");

      return {
        success: true,
        id: template.id,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  });

  ipcMain.handle("template-getAll", async () => {
    try {
      const dir = await ensureTemplateDir();

      const files = await readdir(dir);

      const templates = [];

      for (const file of files) {
        if (!file.endsWith(".json")) continue;

        const filePath = path.join(dir, file);
        const content = await readFile(filePath, "utf-8");

        const parsed = JSON.parse(content);

        templates.push(parsed);
      }

      return {
        success: true,
        templates,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  });
});
