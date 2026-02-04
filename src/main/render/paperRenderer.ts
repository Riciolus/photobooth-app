import sharp from "sharp";
import fs from "fs/promises";
import path from "path";
import { PaperTemplate } from "src/shared/paper";
import { computeStripRects } from "./layout/computeStripRects";

export async function renderPaper({
  paper,
  stripPath,
  outputPath,
}: {
  paper: PaperTemplate;
  stripPath: string;
  outputPath: string;
}) {
  // ensure output dir exists
  await fs.mkdir(path.dirname(outputPath), { recursive: true });

  // read strip image
  const stripImage = sharp(stripPath).rotate(paper.layout.rotateStrip ?? 90);
  const stripMeta = await stripImage.metadata();

  if (!stripMeta.width || !stripMeta.height) {
    throw new Error("Invalid strip image dimensions");
  }

  const stripSize =
    paper.layout.rotateStrip === 90 || paper.layout.rotateStrip === 270
      ? { width: stripMeta.height!, height: stripMeta.width! }
      : { width: stripMeta.width!, height: stripMeta.height! };

  // compute layout rects
  const rects = computeStripRects(paper, stripSize);

  // create paper canvas
  const canvas = sharp({
    create: {
      width: paper.canvas.width,
      height: paper.canvas.height,
      channels: 4,
      background: paper.canvas.background,
    },
  });

  // prepare composites (reuse same strip buffer)
  const stripBuffer = await stripImage.toBuffer();

  const composites = rects.map((r) => ({
    input: stripBuffer,
    top: r.y,
    left: r.x,
  }));

  // render final paper
  await canvas.composite(composites).png().toFile(outputPath);
}
