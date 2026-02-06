import { EditableTemplate } from "src/shared/types";
import { StripTemplate } from "src/shared/types";

export function exportStripTemplate(editable: EditableTemplate): StripTemplate {
  if (!editable.backgroundImage) {
    throw new Error("Background image missing");
  }

  return {
    id: "custom-template",
    canvas: {
      width: editable.canvas.width,
      height: editable.canvas.height,
      backgroundImage: editable.backgroundImage,
    },

    photoSlots: editable.slots.map((slot) => ({
      x: Math.round(slot.x),
      y: Math.round(slot.y),
      width: Math.round(slot.width),
      height: Math.round(slot.height),
    })),
  };
}
