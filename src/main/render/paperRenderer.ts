import sharp from "sharp";
import path from "path";
import { StripTemplate } from "src/shared/types";
import { StripPreviewState } from "src/renderer/App";

type RenderInput = {
  template: StripTemplate;
  strips: StripPreviewState[];
  outputPath: string;
};

export async function renderPaper({ template, strips, outputPath }: RenderInput) {
  const stripWidth = template.canvas.width;
  const stripHeight = template.canvas.height;

  const paperWidth = stripWidth * strips.length;
  const paperHeight = stripHeight;

  // 1️⃣ base paper
  const paper = sharp({
    create: {
      width: paperWidth,
      height: paperHeight,
      channels: 4,
      background: "#ffffff",
    },
  }).withMetadata({ density: 300 });

  const composites: sharp.OverlayOptions[] = [];

  // 2️⃣ render each strip

  for (let i = 0; i < strips.length; i++) {
    const strip = strips[i];
    const xOffset = i * stripWidth;

    // background
    composites.push({
      input: template.canvas.background.path,
      left: xOffset,
      top: 0,
    });

    for (let idx = 0; idx < strip.photos.length; idx++) {
      const photo = strip.photos[idx];
      const slot = template.photoSlots[idx];
      if (!slot) continue;

      // 🔥 MATCH object-fit: cover
      const resized = await sharp(photo.path)
        .resize(slot.width, slot.height, {
          fit: "cover", // SAMA PERSIS kayak CSS
          position: "center",
        })
        .toBuffer();

      composites.push({
        input: resized,
        left: Math.round(xOffset + slot.x),
        top: Math.round(slot.y),
      });
    }
  }

  // 3️⃣ composite everything
  await paper.composite(composites).png({ quality: 100 }).toFile(outputPath);
}
