import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import { StripTemplate } from "src/shared/types";

type RenderStripInput = {
  template: StripTemplate;
  photos: string[];
  outputPath: string;
};

export async function renderStrip({
  template,
  photos,
  outputPath,
}: RenderStripInput) {
  const expectedPhotos = template.photoSlots.length;

  if (photos.length !== expectedPhotos) {
    throw new Error(`Expected ${expectedPhotos} photos, got ${photos.length}`);
  }

  // 1️⃣ ensure output dir exists
  await fs.mkdir(path.dirname(outputPath), { recursive: true });

  // 2️⃣ create base canvas
  const base = template.canvas.backgroundImage
    ? sharp(template.canvas.backgroundImage).resize(
        template.canvas.width,
        template.canvas.height,
        { fit: "fill" }
      )
    : sharp({
        create: {
          width: template.canvas.width,
          height: template.canvas.height,
          channels: 4,
          background: "#ffffff",
        },
      });

  // 3️⃣ prepare composites
  const composites = await Promise.all(
    photos.map(async (photoPath, index) => {
      const slot = template.photoSlots[index];

      const buffer = await sharp(photoPath)
        .resize(Math.round(slot.width), Math.round(slot.height), { fit: "cover" })
        .toBuffer();

      return {
        input: buffer,
        top: Math.round(slot.y),
        left: Math.round(slot.x),
      };
    })
  );

  // 4️⃣ composite & export
  await base.composite(composites).png().toFile(outputPath);
}
