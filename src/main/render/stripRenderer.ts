import sharp from "sharp";
import fs from "fs/promises";
import path from "path";
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
  if (photos.length !== template.slots) {
    throw new Error(`Expected ${template.slots} photos, got ${photos.length}`);
  }

  if (template.photoSlots.length !== template.slots) {
    throw new Error(
      `Template photoSlots (${template.photoSlots.length}) does not match slots (${template.slots})`
    );
  }

  // 1️⃣ ensure output dir exists
  await fs.mkdir(path.dirname(outputPath), { recursive: true });

  // 2️⃣ load background PNG
  const base = sharp(template.background.imagePath).resize(
    template.background.width,
    template.background.height,
    { fit: "fill" }
  );

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
