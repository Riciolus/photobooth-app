import { useState } from "react";
import { EditableTemplate, PhotoSlot, StripTemplate } from "src/shared/types";
import { CanvasStage } from "../components/CanvasStage";
import { exportStripTemplate } from "../utils/exportTemplate";
import { Button } from "../ui/Button";
import clsx from "clsx";

type Props = {
  onSave: (template: StripTemplate) => void;
};

export default function TemplateEditor({ onSave }: Props) {
  const [template, setTemplate] = useState<EditableTemplate>({
    backgroundImage: null,
    canvas: { width: 0, height: 0 },
    slots: [],
  });

  function handleBackgroundUpload(file: File) {
    const url = URL.createObjectURL(file);

    const img = new Image();
    img.onload = () => {
      setTemplate((prev) => ({
        ...prev,
        backgroundImage: url,
        canvas: {
          width: img.width,
          height: img.height,
        },
      }));
    };
    img.src = url;
  }

  function handleAddSlot() {
    setTemplate((prev) => {
      const firstSlot = prev.slots[0];

      return {
        ...prev,
        slots: [
          ...prev.slots,
          {
            id: crypto.randomUUID(),
            x: 100,
            y: 100,
            width: firstSlot ? firstSlot.width : 550,
            height: firstSlot ? firstSlot.height : 400,
          },
        ],
      };
    });
  }

  function handleSave() {
    const runtime = exportStripTemplate(template);
    onSave(runtime);
  }

  const isTemplateInvalid = !template.backgroundImage || template.slots.length === 0;

  return (
    <div className="text-[#232020]  flex h-screen bg-[#ffdfc7]">
      {/* Toolbar */}
      <div className="max-w-60 space-y-4 px-3 py-8">
        <div className="text-xl text-center font-mono font-semibold italic tracking-tighter">
          Loco Booth
        </div>

        <div className="space-y-3 flex flex-col items-center">
          <label
            className={clsx(
              "inline-flex items-center justify-center cursor-pointer p-2 w-40",
              "font-mono font-semibold text-sm  rounded-2xl",
              "transition-colors focus-within:ring-2 focus-within:ring-offset-2",
              "bg-[#F06647] border-2 border-yellow-900 text-yellow-950",
              "hover:bg-lime-500/10"
            )}
          >
            Upload Strip
            <input
              type="file"
              accept="image/png"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleBackgroundUpload(file);
              }}
            />
          </label>

          <Button className="w-40" onClick={handleAddSlot}>
            Add Slot
          </Button>

          <Button className="w-40" disabled={isTemplateInvalid} onClick={handleSave}>
            Next
            <img
              className="size-9"
              src="./assets/icons/right-arrow.svg"
              alt="right arrow"
            />
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <div className="w-full py-3 pr-3 max-h-screen h-full">
        <CanvasStage template={template} onChange={setTemplate} />
      </div>
    </div>
  );
}
