import { PaperTemplate } from "src/shared/paper";

type Size = {
  width: number;
  height: number;
};

type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export function computeStripRects(paper: PaperTemplate, strip: Size): Rect[] {
  const { width: paperW, height: paperH } = paper.canvas;
  const { copies, spacing, direction, align } = paper.layout;

  const totalSize =
    direction === "vertical"
      ? strip.height * copies + spacing * (copies - 1)
      : strip.width * copies + spacing * (copies - 1);

  // starting offset (center / start)
  const startOffset =
    align === "center"
      ? direction === "vertical"
        ? Math.floor((paperH - totalSize) / 2)
        : Math.floor((paperW - totalSize) / 2)
      : 0;

  return Array.from({ length: copies }).map((_, i) => {
    const mainOffset =
      i *
      (direction === "vertical"
        ? strip.height + spacing
        : strip.width + spacing);

    const x =
      direction === "vertical"
        ? Math.floor((paperW - strip.width) / 2)
        : startOffset + mainOffset;

    const y =
      direction === "vertical"
        ? startOffset + mainOffset
        : Math.floor((paperH - strip.height) / 2);

    return {
      x,
      y,
      width: strip.width,
      height: strip.height,
    };
  });
}
