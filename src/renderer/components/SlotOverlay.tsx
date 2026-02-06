import { useRef } from "react";
import { PhotoSlot } from "src/shared/types";

type Props = {
  slot: PhotoSlot;
  idx: number;
  onChange: (slot: PhotoSlot) => void;
};

const SLOT_COLORS = [
  {
    bg: "bg-red-200/50",
    border: "border-red-500",
    handle: "bg-red-500",
    text: "text-red-700",
  },
  {
    bg: "bg-green-200/50",
    border: "border-green-500",
    handle: "bg-green-500",
    text: "text-green-700",
  },
  {
    bg: "bg-blue-200/50",
    border: "border-blue-500",
    handle: "bg-blue-500",
    text: "text-blue-700",
  },
  {
    bg: "bg-yellow-200/50",
    border: "border-yellow-500",
    handle: "bg-yellow-500",
    text: "text-yellow-700",
  },
];

export function SlotOverlay({ slot, onChange, idx }: Props) {
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

  const color = SLOT_COLORS[idx % SLOT_COLORS.length];

  return (
    <div
      className={`
      ${color.bg}
      ${color.border}
      flex justify-center items-center
      border-2 border-dashed
    `}
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
      <div className={`text-5xl font-semibold font-sans ${color.text}`}>
        {idx + 1}
      </div>

      {/* Resize handle */}
      <div
        onPointerDown={onPointerDownResize}
        onPointerMove={onPointerMoveResize}
        onPointerUp={onPointerUpResize}
        className={`${color.handle}`}
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
