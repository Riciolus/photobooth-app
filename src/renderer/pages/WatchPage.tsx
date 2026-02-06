import { StripTemplate } from "src/shared/types";
import StripPreview from "../components/StripPreview";
import { StripPreviewState } from "../App";

const A4_WIDTH = 2480;
const A4_HEIGHT = 3508;
const PREVIEW_SCALE = 0.2; // adjust zoom

type Props = {
  template: StripTemplate;
  strips: StripPreviewState[];
};

export default function WatchPage({ template, strips }: Props) {
  const activeIndex = strips.findIndex(
    (s) => s.photos.length < template.photoSlots.length
  );

  return (
    <div className="text-[#121212] p-3 flex w-full h-screen bg-[#fefefe]">
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
