import { EditableTemplate, PhotoSlot } from "src/shared/types";
import { SlotOverlay } from "./SlotOverlay";

type Props = {
  template: EditableTemplate;
  onChange: (t: EditableTemplate) => void;
};

const SCALE = 0.3; // contoh, nanti bisa dynamic

export function CanvasStage({ template, onChange }: Props) {
  function updateSlot(updatedSlot: PhotoSlot) {
    onChange({
      ...template,
      slots: template.slots.map((s) => (s.id === updatedSlot.id ? updatedSlot : s)),
    });
  }

  return (
    <div style={{ overflow: "auto", padding: 20 }}>
      <div
        style={{
          position: "relative",
          width: template.canvas.width,
          height: template.canvas.height,
          backgroundImage: `url(${template.backgroundImage})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          transform: `scale(${SCALE})`,
          transformOrigin: "top left",
        }}
      >
        {template.slots.map((slot) => (
          <SlotOverlay key={slot.id} slot={slot} onChange={updateSlot} />
        ))}
      </div>
    </div>
  );
}
