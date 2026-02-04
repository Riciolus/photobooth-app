import { StripTemplate } from "src/shared/types";

type Props = {
  template: StripTemplate;
};

export default function WatchPage({ template }: Props) {
  return (
    <div
      style={{
        position: "relative",
        width: template.canvas.width,
        height: template.canvas.height,
        backgroundImage: `url(${template.canvas.backgroundImage})`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "top left",
        border: "1px solid #ccc",
      }}
    >
      {template.photoSlots.map((slot, i) => (
        <img
          key={i}
          src={`/dummy/photo${(i % 3) + 1}.jpg`}
          style={{
            position: "absolute",
            left: slot.x,
            top: slot.y,
            width: slot.width,
            height: slot.height,
            objectFit: "cover",
            border: "1px solid red",
          }}
        />
      ))}
    </div>
  );
}
