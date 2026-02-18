import { useState } from "react";
import { EditableTemplate, StripTemplate } from "src/shared/types";
import { CanvasStage } from "../components/CanvasStage";
import { exportStripTemplate } from "../utils/exportTemplate";
import { Button } from "../ui/Button";
import LoadTemplateModal from "../components/TemplateModal";

type Props = {
  onSave: (template: StripTemplate) => void;
};

export default function TemplateEditor({ onSave }: Props) {
  const [template, setTemplate] = useState<EditableTemplate>({
    canvas: { width: 0, height: 0, background: { path: null, preview: null } },
    slots: [],
  });
  const [modalOpen, setModalOpen] = useState(false);

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

  function handleRemoveBackground() {
    setTemplate((prev) => ({
      ...prev,
      canvas: {
        width: prev.canvas.width,
        height: prev.canvas.height,
        background: {
          path: null,
          preview: null,
        },
      },
    }));
  }

  async function handleLoadTemplates() {
    const result = await window.api.getTemplates();

    if (!result.success) {
      return;
    }

    setModalOpen(true);
    // show popup with preview
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

  function removeLastSlot() {
    setTemplate((prev) => {
      return {
        ...prev,
        slots: template.slots.slice(0, -1),
      };
    });
  }

  function handleSave() {
    const runtime = exportStripTemplate(template);

    window.api.saveTemplate(runtime);
    onSave(runtime);
  }

  const isTemplateInvalid =
    !template.canvas.background || template.slots.length === 0;

  return (
    <div className="text-[#232020]  flex h-screen bg-[#ffdfc7]">
      <LoadTemplateModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSelect={(template) => {
          onSave(template); // your active template state
        }}
      />

      {/* Toolbar */}
      <div className="max-w-52 w-full space-y-4 px-3 py-8">
        <div className="text-xl text-center font-mono font-semibold italic tracking-tighter">
          Loco Booth
        </div>

        <div className="space-y-3 flex flex-col items-center">
          <div className="flex w-40 space-x-1">
            <Button className="w-full" onClick={handlePickBackground}>
              Upload Strip
            </Button>

            {template.canvas.background.preview && (
              <Button className="w-18 p-0" onClick={handleRemoveBackground}>
                <img
                  className="size-9"
                  src="./assets/icons/trash-bin.svg"
                  alt="trash-bin"
                />
              </Button>
            )}
          </div>

          <Button className="w-40" onClick={handleLoadTemplates}>
            Load Strip
          </Button>

          <div className="flex w-40 space-x-2">
            <Button
              disabled={template.canvas.background.preview ? false : true}
              className="w-full"
              onClick={handleAddSlot}
            >
              Add Slot
            </Button>

            {template.slots.length > 0 && (
              <Button className="w-full" onClick={removeLastSlot}>
                Remove Slot
              </Button>
            )}
          </div>

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
