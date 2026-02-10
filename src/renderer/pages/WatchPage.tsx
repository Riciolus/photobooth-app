import { StripTemplate } from "src/shared/types";
import StripPreview from "../components/StripPreview";
import { StripPreviewState } from "../App";
import { Button } from "../ui/Button";
import { useState } from "react";

const MIN_SCALE = 0.2;
const MAX_SCALE = 1;
const STEP = 0.025;

// const A4_WIDTH = 2480;
// const A4_HEIGHT = 3508;

type Props = {
  template: StripTemplate;
  strips: StripPreviewState[];
  onChangeStrips: React.Dispatch<React.SetStateAction<StripPreviewState[]>>;
};

export default function WatchPage({ template, strips, onChangeStrips }: Props) {
  const [scale, setScale] = useState(0.4);

  const activeIndex = strips.findIndex(
    (s) => s.photos.length < template.photoSlots.length
  );

  function zoomIn() {
    setScale((s) => Math.min(MAX_SCALE, +(s + STEP).toFixed(2)));
  }

  function zoomOut() {
    setScale((s) => Math.max(MIN_SCALE, +(s - STEP).toFixed(2)));
  }

  async function handleReplacePhoto(stripIndex: number, slotIndex: number) {
    const result = await window.api.pickPhoto();
    if (!result) return;

    onChangeStrips((prev) => {
      const next = prev.map((s) => ({
        photos: [...s.photos],
      }));

      next[stripIndex].photos[slotIndex] = {
        path: result.path,
        preview: `strip://${result.path}`,
      };

      return next;
    });
  }

  const paperWidth = template.canvas.width * strips.length;
  const paperHeight = template.canvas.height;

  return (
    <div className="text-[#232020] flex h-screen bg-[#ffdfc7] w-screen overflow-hidden">
      {/* Toolbar */}
      <div className="max-w-52 w-full space-y-4 px-3 py-8">
        <div className="text-xl text-center font-mono font-semibold italic tracking-tighter">
          Loco Booth
        </div>

        <div className="space-y-3 flex flex-col items-center">
          <Button
            className="w-40"
            onClick={() => {
              window.api.exportPaper({
                template,
                strips,
              });
            }}
          >
            Export Image
          </Button>

          <Button className="w-40">
            Back
            <img
              className="size-9 rotate-180"
              src="./assets/icons/right-arrow.svg"
              alt="right arrow"
            />
          </Button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="w-full py-3 pr-3 max-h-screen h-full overflow-hidden">
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <Button onClick={zoomOut}>−</Button>
          <Button className="text-base bg-transparent hover:bg-transparent">
            {Math.round(scale * 100)}%
          </Button>
          <Button onClick={zoomIn}>+</Button>
        </div>

        <div className="w-full h-full flex items-center justify-center overflow-hidden bg-[#fff9f1] rounded-3xl">
          <div
            style={{
              transform: `scale(${scale})`,
              transformOrigin: "center",
            }}
          >
            <div
              style={{
                position: "relative",
                width: paperWidth,
                height: paperHeight,
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
                  onReplace={handleReplacePhoto}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
