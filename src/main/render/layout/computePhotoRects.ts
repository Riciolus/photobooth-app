import { StripTemplate } from "src/shared/types"

type PhotoRect = {
  x: number
  y: number
  width: number
  height: number
}

export function computePhotoRects(template: StripTemplate): PhotoRect[] {
  const canvasWidth = template.canvas.width
  const canvasHeight = template.canvas.height

  const padding = template.layout.padding
  const spacing = template.layout.spacing
  const slotCount = template.slots

  if (slotCount <= 0) {
    throw new Error("Template must have at least 1 slot")
  }

  // total vertical space available for photos
  const availableHeight =
    canvasHeight - padding * 2 - spacing * (slotCount - 1)

  if (availableHeight <= 0) {
    throw new Error("Invalid layout: not enough vertical space")
  }

  // 🔒 sanitize to integer
  const photoHeight = Math.floor(availableHeight / slotCount)
  const photoWidth = Math.floor(
    photoHeight * template.photo.aspectRatio
  )

  if (photoWidth <= 0 || photoHeight <= 0) {
    throw new Error("Computed photo size is invalid")
  }

  const x = Math.floor((canvasWidth - photoWidth) / 2)

  return Array.from({ length: slotCount }).map((_, i) => ({
    x,
    y: Math.floor(padding + i * (photoHeight + spacing)),
    width: photoWidth,
    height: photoHeight,
  }))
}
