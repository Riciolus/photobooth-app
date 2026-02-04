import { useRef } from "react";
import { PhotoSlot } from "src/shared/types";

type Props = {
  slot: PhotoSlot;
  onChange: (slot: PhotoSlot) => void;
};

export function SlotOverlay({ slot, onChange }: Props) {
  const dragRef = useRef<{ dx: number; dy: number } | null>(null);
  const resizeRef = useRef<{ w: number; h: number; sx: number; sy: number } | null>(
    null
  );

  /* ===== MOVE SLOT ===== */
  function onPointerDownMove(e: React.PointerEvent) {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);

    dragRef.current = {
      dx: e.clientX - slot.x,
      dy: e.clientY - slot.y,
    };
  }

  function onPointerMoveMove(e: React.PointerEvent) {
    if (!dragRef.current) return;

    onChange({
      ...slot,
      x: Math.round(e.clientX - dragRef.current.dx),
      y: Math.round(e.clientY - dragRef.current.dy),
    });
  }

  function onPointerUpMove(e: React.PointerEvent) {
    dragRef.current = null;
    e.currentTarget.releasePointerCapture(e.pointerId);
  }

  /* ===== RESIZE SLOT ===== */
  function onPointerDownResize(e: React.PointerEvent) {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);

    resizeRef.current = {
      w: slot.width,
      h: slot.height,
      sx: e.clientX,
      sy: e.clientY,
    };
  }

  function onPointerMoveResize(e: React.PointerEvent) {
    if (!resizeRef.current) return;

    const dx = e.clientX - resizeRef.current.sx;
    const dy = e.clientY - resizeRef.current.sy;

    onChange({
      ...slot,
      width: Math.max(20, Math.round(resizeRef.current.w + dx)),
      height: Math.max(20, Math.round(resizeRef.current.h + dy)),
    });
  }

  function onPointerUpResize(e: React.PointerEvent) {
    resizeRef.current = null;
    e.currentTarget.releasePointerCapture(e.pointerId);
  }

  return (
    <div
      onPointerDown={onPointerDownMove}
      onPointerMove={onPointerMoveMove}
      onPointerUp={onPointerUpMove}
      style={{
        position: "absolute",
        left: slot.x,
        top: slot.y,
        width: slot.width,
        height: slot.height,
        border: "2px dashed red",
        boxSizing: "border-box",
        cursor: "move",
      }}
    >
      {/* Resize handle */}
      <div
        onPointerDown={onPointerDownResize}
        onPointerMove={onPointerMoveResize}
        onPointerUp={onPointerUpResize}
        style={{
          position: "absolute",
          right: -6,
          bottom: -6,
          width: 12,
          height: 12,
          background: "red",
          cursor: "nwse-resize",
        }}
      />
    </div>
  );
}
