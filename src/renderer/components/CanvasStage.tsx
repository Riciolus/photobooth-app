import { EditableTemplate, PhotoSlot } from "src/shared/types";
import { SlotOverlay } from "./SlotOverlay";

type Props = {
  template: EditableTemplate;
  onChange: (t: EditableTemplate) => void;
};

const SCALE = 0.5; // contoh, nanti bisa dynamic

export function CanvasStage({ template, onChange }: Props) {
  function updateSlot(updatedSlot: PhotoSlot) {
    onChange({
      ...template,
      slots: template.slots.map((s) => (s.id === updatedSlot.id ? updatedSlot : s)),
    });
  }

  return (
    <div className="w-full h-screen flex justify-center ">
      <div
        className="relative"
        style={{
          width: template.canvas.width,
          height: template.canvas.height,
          backgroundImage: `url(${template.backgroundImage})`,
          backgroundSize: "contain",
          transform: `scale(${SCALE})`,
          transformOrigin: "top left",
        }}
      >
        {template.slots.map((slot, idx) => (
          <SlotOverlay key={slot.id} idx={idx} slot={slot} onChange={updateSlot} />
        ))}
      </div>
    </div>
  );
}
