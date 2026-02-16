import { useLayoutEffect, useRef, useState } from "react";
import { SlotOverlay } from "./SlotOverlay";
import { Button } from "../ui/Button";
import { EditableTemplate, PhotoSlot } from "src/shared/types";

type Props = {
  template: EditableTemplate;
  onChange: (t: EditableTemplate) => void;
};

const MIN_SCALE = 0.2;
const MAX_SCALE = 1.5;
const STEP = 0.1;

export function CanvasStage({ template, onChange }: Props) {
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const resize = () => {
      const { width, height } = containerRef.current!.getBoundingClientRect();

      if (!template.canvas.width || !template.canvas.height) {
        setScale(1);
        return;
      }

      const fitScale = Math.min(
        width / template.canvas.width,
        height / template.canvas.height
      );

      setScale(fitScale);
    };

    resize();

    const observer = new ResizeObserver(resize);
    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [template]);

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
        <Button className="bg-transparent pointer-events-none">
          {Math.round(scale * 100)}%
        </Button>
        <Button onClick={zoomIn}>+</Button>
      </div>

      {/* VIEWPORT */}
      <div
        ref={containerRef}
        className="w-full h-full flex items-center justify-center"
      >
        {/* SCALE WRAPPER (UI ONLY) */}
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "center",
          }}
        >
          {/* REAL CANVAS (REAL PIXELS) */}
          <div
            className="relative"
            style={{
              width: template.canvas.width,
              height: template.canvas.height,
              backgroundImage: `url(${template.canvas.background.preview})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "contain",
              backgroundPosition: "center",
            }}
          >
            {template.slots.map((slot, idx) => (
              <SlotOverlay
                key={slot.id}
                slot={slot}
                idx={idx}
                scale={scale} // 🔥 KRUSIAL
                onChange={updateSlot}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
