import { PhotoAsset } from "src/shared/render";
import { StripTemplate } from "src/shared/types";
import { Button } from "../ui/Button";

type Props = {
  template: StripTemplate;
  photos: PhotoAsset[];
  index: number;
  active: boolean;
  onReplace: (stripIndex: number, slotIndex: number) => void;
};

export default function StripPreview({
  template,
  photos,
  index,
  active,
  onReplace,
}: Props) {
  const stripWidth = template.canvas.width;
  const stripHeight = template.canvas.height;

  const STRIP_GAP = 30;
  const x = index * (stripWidth + STRIP_GAP);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: 0,
        width: stripWidth,
        height: stripHeight,
        outline: active ? "8px solid red" : "none",
        backgroundImage: `url(${template.canvas.background.preview})`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
      }}
    >
      {template.photoSlots.map((slot, i) => {
        const photo = photos[i];
        if (!photo) return null;

        return (
          <div
            key={i}
            onClick={() => onReplace(index, i)}
            style={{
              position: "absolute",
              left: slot.x,
              top: slot.y,
              width: slot.width,
              height: slot.height,
              cursor: "pointer",
            }}
            className="group"
          >
            {/* PHOTO */}
            <img
              src={photo.preview}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />

            {/* HOVER OVERLAY */}
            <div
              className="
          absolute inset-0
          bg-teal-400/30
          opacity-0
          group-hover:opacity-100
          transition-opacity
          flex items-center justify-center
        "
            >
              <span className="text-neutral-50 p-3 border-2 border-teal-950 bg-teal-700 rounded-2xl text-4xl font-semibold tracking-wide">
                Replace
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
