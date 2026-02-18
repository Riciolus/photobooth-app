import { useEffect, useState } from "react";
import type { StripTemplate } from "../../shared/types";
import TemplatePreview from "./TemplatePreview";

type Props = {
  open: boolean;
  onClose: () => void;
  onSelect: (template: StripTemplate) => void;
};

export default function LoadTemplateModal({ open, onClose, onSelect }: Props) {
  const [templates, setTemplates] = useState<StripTemplate[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    setLoading(true);

    window.api.getTemplates().then((result) => {
      if (result.success && result.templates) {
        setTemplates(result.templates);
      }
      setLoading(false);
    });
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-[900px] max-h-[85vh] text-[#232020]  rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between bg-[#ffdfc7] px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Load Template</h2>
          <button
            onClick={onClose}
            className="text-gray-700 hover:text-black transition"
          >
            X
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#fff9f1]">
          {loading && <p className="text-gray-500 text-sm">Loading templates...</p>}

          {!loading && templates.length === 0 && (
            <p className="text-gray-500 text-sm">No templates found.</p>
          )}

          <div className="grid grid-cols-3 gap-6">
            {templates.map((template) => (
              <div
                key={template.id}
                onClick={() => {
                  onSelect(template);
                  onClose();
                }}
                className="cursor-pointer border rounded-3xl p-4 hover:shadow-lg hover:border-black transition bg-gray-50"
              >
                <div className="flex justify-center">
                  <TemplatePreview template={template} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
