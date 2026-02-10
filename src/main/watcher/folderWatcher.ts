import { watch } from "chokidar";
import path from "path";
console.log("🔥 folderWatcher module loaded");

const VALID_EXT = [".jpg", ".jpeg", ".png"];

export function startFolderWatcher(
  folderPath: string,
  onPhotoReady: (path: string) => void
) {
  // console.log("👀 Watching folder:", folderPath);

  const watcher = watch(folderPath, {
    ignoreInitial: true,
    usePolling: true,
    awaitWriteFinish: {
      stabilityThreshold: 1000,
      pollInterval: 100,
    },
  });

  watcher.on("add", (filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    if (!VALID_EXT.includes(ext)) return;

    // console.log("📸 File added:", filePath);
    onPhotoReady(filePath);
  });

  return watcher;
}
