import { useState } from "react";
import { EditableTemplate, StripTemplate } from "src/shared/types";
import { CanvasStage } from "../components/CanvasStage";
import { exportStripTemplate } from "../utils/exportTemplate";
import { Button } from "../ui/Button";

type Props = {
  onSave: (template: StripTemplate) => void;
};

export default function TemplateEditor({ onSave }: Props) {
  const [template, setTemplate] = useState<EditableTemplate>({
    canvas: { width: 0, height: 0, background: { path: null, preview: null } },
    slots: [],
  });

  async function handlePickBackground() {
    const result = await window.api.pickBackground();
    if (!result) return;

    setTemplate((prev) => ({
      ...prev,
      canvas: {
        width: result.width,
        height: result.height,
        background: {
          path: result.path, // filesystem
          preview: `strip://${result.path}`, // UI
        },
      },
    }));
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

  const isTemplateInvalid =
    !template.canvas.background || template.slots.length === 0;

  return (
    <div className="text-[#232020]  flex h-screen bg-[#ffdfc7]">
      {/* Toolbar */}
      <div className="max-w-60 space-y-4 px-3 py-8">
        <div className="text-xl text-center font-mono font-semibold italic tracking-tighter">
          Loco Booth
        </div>

        <div className="space-y-3 flex flex-col items-center">
          <Button className="w-40" onClick={handlePickBackground}>
            Upload Strip
          </Button>

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
