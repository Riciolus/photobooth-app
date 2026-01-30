import fs from "fs/promises"
import path from "path"
import sharp from "sharp"
import { computePhotoRects } from "./layout/computePhotoRects"

export async function renderStrip({
  template,
  photos,
  outputPath,
}: {
  template: any
  photos: string[]
  outputPath: string
}) {
  // 🔑 ENSURE DIRECTORY EXISTS
  const dir = path.dirname(outputPath)
  await fs.mkdir(dir, { recursive: true })

  // lanjut render seperti biasa
  const canvas = sharp({
  create: {
    width: template.canvas.width,
    height: template.canvas.height,
    channels: 4,
    background: template.canvas.background,
  },
})


  const rects = computePhotoRects(template)

const composites = await Promise.all(
  photos.map(async (photoPath, index) => {
    const rect = rects[index]

    const img = await sharp(photoPath)
      .resize(rect.width, rect.height)
      .toBuffer()

    return {
      input: img,
      top: rect.y,
      left: rect.x,
    }
  })
)


  await canvas.composite(composites).png().toFile(outputPath)
}
