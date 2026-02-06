import { useState } from "react";
import { EditableTemplate, PhotoSlot, StripTemplate } from "src/shared/types";
import { CanvasStage } from "../components/CanvasStage";
import { exportStripTemplate } from "../utils/exportTemplate";
import { Button } from "../ui/Button";

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
    setTemplate((prev) => ({
      ...prev,
      slots: [
        ...prev.slots,
        {
          id: crypto.randomUUID(),
          x: 100,
          y: 100,
          width: 300,
          height: 400,
        },
      ],
    }));
  }

  function handleSave() {
    const runtime = exportStripTemplate(template);
    onSave(runtime);
  }

  return (
    <div className="text-[#121212] p-3 flex h-screen bg-[#fefefe]">
      {/* Toolbar */}
      <div className="w-60 border space-y-4 border-[#242827] bg-lime-700/5  rounded-3xl p-3">
        <Button className="w-40" onClick={handleAddSlot}>
          Add Slot
        </Button>

        <input
          className="w-40"
          type="file"
          accept="image/png"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleBackgroundUpload(file);
          }}
        />

        <Button className="w-40" onClick={handleSave}>
          Save Template
        </Button>
      </div>

      {/* Canvas */}
      <CanvasStage template={template} onChange={setTemplate} />
    </div>
  );
}
