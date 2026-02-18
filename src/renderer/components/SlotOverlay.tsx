import { useRef } from "react";
import { PhotoSlot } from "src/shared/types";
import { SLOT_COLORS } from "../constants/slotColors";

type Props = {
  slot: PhotoSlot;
  idx: number;
  scale: number; // 🔥 WAJIB
  onChange: (slot: PhotoSlot) => void;
};

export function SlotOverlay({ slot, idx, scale, onChange }: Props) {
  const dragRef = useRef<{ dx: number; dy: number } | null>(null);
  const resizeRef = useRef<{
    w: number;
    h: number;
    sx: number;
    sy: number;
  } | null>(null);

  /* ===== MOVE ===== */
  function onPointerDownMove(e: React.PointerEvent) {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);

    dragRef.current = {
      dx: e.clientX / scale - slot.x,
      dy: e.clientY / scale - slot.y,
    };
  }

  function onPointerMoveMove(e: React.PointerEvent) {
    if (!dragRef.current) return;

    onChange({
      ...slot,
      x: Math.round(e.clientX / scale - dragRef.current.dx),
      y: Math.round(e.clientY / scale - dragRef.current.dy),
    });
  }

  function onPointerUpMove(e: React.PointerEvent) {
    dragRef.current = null;
    e.currentTarget.releasePointerCapture(e.pointerId);
  }

  /* ===== RESIZE ===== */
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

    const dx = (e.clientX - resizeRef.current.sx) / scale;
    const dy = (e.clientY - resizeRef.current.sy) / scale;

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

  const color = SLOT_COLORS[idx % SLOT_COLORS.length];

  return (
    <div
      className={`${color.bg} ${color.border} border-2 border-dashed flex items-center justify-center`}
      onPointerDown={onPointerDownMove}
      onPointerMove={onPointerMoveMove}
      onPointerUp={onPointerUpMove}
      style={{
        position: "absolute",
        left: slot.x,
        top: slot.y,
        width: slot.width,
        height: slot.height,
        boxSizing: "border-box",
        cursor: "move",
      }}
    >
      <div className={`text-5xl font-semibold ${color.text}`}>{idx + 1}</div>

      {/* RESIZE HANDLE */}
      <div
        onPointerDown={onPointerDownResize}
        onPointerMove={onPointerMoveResize}
        onPointerUp={onPointerUpResize}
        className={color.handle}
        style={{
          position: "absolute",
          right: -6,
          bottom: -6,
          width: 12,
          height: 12,
          cursor: "nwse-resize",
        }}
      />
    </div>
  );
}
