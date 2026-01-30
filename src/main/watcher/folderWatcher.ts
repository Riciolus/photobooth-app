import chokidar from "chokidar"
import path from "path"
console.log("🔥 folderWatcher module loaded");

const VALID_EXT = [".jpg", ".jpeg", ".png"]

export function startFolderWatcher(
  folderPath: string,
  onPhotoReady: (path: string) => void
) {
  console.log("👀 Watching folder:", folderPath)

  const watcher = chokidar.watch(folderPath, {
    ignoreInitial: true,
    usePolling: true, // 👈 THIS IS THE FIX
    awaitWriteFinish: {
      stabilityThreshold: 1000,
      pollInterval: 100,
    },
  })

  watcher.on("add", (filePath) => {
    const ext = path.extname(filePath).toLowerCase()
    if (!VALID_EXT.includes(ext)) return

    console.log("📸 File added:", filePath)
    onPhotoReady(filePath)
  })

  return watcher
}
