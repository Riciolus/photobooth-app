import { StripTemplate } from "src/shared/types";

type Props = {
  template: StripTemplate;
  photos: string[];
  index: number;
  active: boolean;
};

export default function StripPreview({ template, photos, index, active }: Props) {
  const stripWidth = template.canvas.width;
  const stripHeight = template.canvas.height;

  const x = index * stripWidth; // 🔥 mepet kiri ke kanan

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: 0,
        width: stripWidth,
        height: stripHeight,
        outline: active ? "4px solid red" : "none",
        backgroundImage: `url(${template.canvas.backgroundImage})`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
      }}
    >
      {template.photoSlots.map((slot, i) => {
        const photo = photos[i];
        if (!photo) return null;

        return (
          <img
            key={i}
            src={`strip://${photo}`}
            style={{
              position: "absolute",
              left: slot.x,
              top: slot.y,
              width: slot.width,
              height: slot.height,
              objectFit: "cover",
            }}
          />
        );
      })}
    </div>
  );
}
