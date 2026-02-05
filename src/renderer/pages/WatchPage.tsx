import { StripTemplate } from "src/shared/types";
import StripPreview from "../components/StripPreview";
import { StripPreviewState } from "../App";

const A4_WIDTH = 2480;
const A4_HEIGHT = 3508;
const PREVIEW_SCALE = 0.18; // adjust zoom

type Props = {
  template: StripTemplate;
  strips: StripPreviewState[];
};

export default function WatchPage({ template, strips }: Props) {
  const activeIndex = strips.findIndex(
    (s) => s.photos.length < template.photoSlots.length
  );

  return (
    <div
      style={{
        width: A4_WIDTH * PREVIEW_SCALE,
        height: A4_HEIGHT * PREVIEW_SCALE,
        margin: "0 auto",
        background: "#eee",
        overflow: "hidden",
      }}
    >
      {/* PAPER */}
      <div
        style={{
          position: "relative",
          width: A4_WIDTH,
          height: A4_HEIGHT,
          transform: `scale(${PREVIEW_SCALE})`,
          transformOrigin: "top left",
          background: "white",
        }}
      >
        {strips.map((strip, index) => (
          <StripPreview
            key={index}
            template={template}
            photos={strip.photos}
            index={index}
            active={index === activeIndex}
          />
        ))}
      </div>
    </div>
  );
}
