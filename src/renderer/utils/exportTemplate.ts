import { EditableTemplate } from "src/shared/types";
import { StripTemplate } from "src/shared/types";

export function exportStripTemplate(editable: EditableTemplate): StripTemplate {
  if (!editable.canvas.background) {
    throw new Error("Background image missing");
  }

  return {
    id: crypto.randomUUID(),

    canvas: {
      width: editable.canvas.width,
      height: editable.canvas.height,
      background: editable.canvas.background,
    },

    photoSlots: editable.slots.map((slot) => ({
      id: slot.id,
      x: Math.round(slot.x),
      y: Math.round(slot.y),
      width: Math.round(slot.width),
      height: Math.round(slot.height),
    })),
  };
}
