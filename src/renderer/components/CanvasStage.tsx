import { EditableTemplate, PhotoSlot } from "src/shared/types";
import { SlotOverlay } from "./SlotOverlay";
import { useState } from "react";
import { Button } from "../ui/Button";

type Props = {
  template: EditableTemplate;
  onChange: (t: EditableTemplate) => void;
};

const MIN_SCALE = 0.2;
const MAX_SCALE = 1.5;
const STEP = 0.1;

export function CanvasStage({ template, onChange }: Props) {
  const [scale, setScale] = useState(0.4);

  function updateSlot(updatedSlot: PhotoSlot) {
    onChange({
      ...template,
      slots: template.slots.map((s) => (s.id === updatedSlot.id ? updatedSlot : s)),
    });
  }

  function zoomIn() {
    setScale((s) => Math.min(MAX_SCALE, +(s + STEP).toFixed(2)));
  }

  function zoomOut() {
    setScale((s) => Math.max(MIN_SCALE, +(s - STEP).toFixed(2)));
  }

  return (
    <div className="relative w-full h-full bg-[#fff9f1] rounded-3xl overflow-hidden">
      {/* ZOOM CONTROLS */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button onClick={zoomOut}>−</Button>
        <Button className="text-base bg-transparent hover:bg-transparent">
          {Math.round(scale * 100)}%
        </Button>
        <Button onClick={zoomIn}>+</Button>
      </div>

      {/* VIEWPORT */}
      <div className="w-full h-full flex items-center justify-center">
        {/* SCALE WRAPPER */}
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "center",
          }}
        >
          {/* REAL CANVAS */}
          <div
            className="relative"
            style={{
              width: template.canvas.width,
              height: template.canvas.height,
              backgroundImage: `url(${template.backgroundImage})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "contain",
              backgroundPosition: "center",
            }}
          >
            {template.slots.map((slot, idx) => (
              <SlotOverlay
                key={slot.id}
                idx={idx}
                slot={slot}
                onChange={updateSlot}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
