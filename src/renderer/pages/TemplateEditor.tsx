import { useState } from "react";
import { EditableTemplate, PhotoSlot, StripTemplate } from "src/shared/types";
import { CanvasStage } from "../components/CanvasStage";
import { exportStripTemplate } from "../utils/exportTemplate";

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
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Toolbar */}
      <div style={{ width: 200, borderRight: "1px solid #ccc" }}>
        <button onClick={handleAddSlot}>Add Slot</button>

        <input
          type="file"
          accept="image/png"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleBackgroundUpload(file);
          }}
        />

        <button onClick={handleSave}>Save Template</button>
      </div>

      {/* Canvas */}
      <CanvasStage template={template} onChange={setTemplate} />
    </div>
  );
}
