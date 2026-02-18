import { useEffect, useRef } from "react";
import type { StripTemplate } from "../../shared/types";
import { SLOT_COLORS } from "../constants/slotColors";

type Props = {
  template: StripTemplate;
};

export default function TemplatePreview({ template }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const previewWidth = 180;
    const scale = previewWidth / template.canvas.width;
    const previewHeight = template.canvas.height * scale;

    canvas.width = previewWidth;
    canvas.height = previewHeight;

    ctx.clearRect(0, 0, previewWidth, previewHeight);

    const img = new Image();
    img.src = template.canvas.background.preview; // must be a valid file path or URL

    img.onload = () => {
      ctx.drawImage(img, 0, 0, previewWidth, previewHeight);

      template.photoSlots.forEach((slot, index) => {
        const color = SLOT_COLORS[index % SLOT_COLORS.length];

        const x = slot.x * scale;
        const y = slot.y * scale;
        const w = slot.width * scale;
        const h = slot.height * scale;

        // Fill (translucent)
        ctx.fillStyle = color.fill;
        ctx.fillRect(x, y, w, h);

        // Dashed border
        ctx.strokeStyle = color.stroke;
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
        ctx.strokeRect(x, y, w, h);
        ctx.setLineDash([]);

        // Optional: slot label
        ctx.fillStyle = color.textColor;
        ctx.font = "12px sans-serif";
        ctx.fillText(`Slot ${index + 1}`, x + 6, y + 16);
      });
    };

    img.onerror = () => {
      // fallback if image fails
      ctx.fillStyle = "#f3f4f6";
      ctx.fillRect(0, 0, previewWidth, previewHeight);
    };
  }, [template]);

  return <canvas ref={canvasRef} className="rounded shadow-sm border" />;
}
