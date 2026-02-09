import { useEffect, useState } from "react";
import { StripTemplate, SessionStage } from "src/shared/types";
import TemplateEditor from "./pages/TemplateEditor";
import WatchPage from "./pages/WatchPage";
import { PhotoAsset } from "src/shared/render";

/* ================= TYPES ================= */

type SessionViewState = {
  stage: SessionStage;
  photos: number;
  strips: string[];
};

export type StripPreviewState = {
  photos: {
    path: string; // filesystem path
    preview: string; // blob URL (UI only)
  }[];
};

const MAX_STRIPS = 5;

/* ================= HELPERS ================= */

function createEmptyStrips(): StripPreviewState[] {
  return Array.from({ length: MAX_STRIPS }, () => ({
    photos: [] as PhotoAsset[],
  }));
}

/* ================= APP ================= */

export default function App() {
  const [template, setTemplate] = useState<StripTemplate | null>(null);
  const [session, setSession] = useState<SessionViewState | null>(null);

  // 🔥 UI STATE (SOURCE OF TRUTH)
  const [strips, setStrips] = useState<StripPreviewState[]>(createEmptyStrips());

  /* ============ IPC LISTENERS ============ */

  useEffect(() => {
    window.api.onSessionUpdated(setSession);

    window.api.onPhotoAdded(({ path }) => {
      if (!template) return;

      setStrips((prev) => {
        const next = prev.map((s) => ({ photos: [...s.photos] }));

        // 👉 cari strip pertama yang BELUM PENUH
        const targetIndex = next.findIndex(
          (s) => s.photos.length < template.photoSlots.length
        );

        if (targetIndex === -1) return prev;

        next[targetIndex].photos.push({
          path, // filesystem path dari main
          preview: `strip://${path}`, // atau blob URL kalau dari input file
        });
        return next;
      });
    });
  }, [template]);

  /* ============ TEMPLATE SAVE ============ */

  function handleTemplateSave(template: StripTemplate) {
    setTemplate(template);
    setStrips(createEmptyStrips()); // reset UI
    window.api.startSession(template);
  }

  /* ============ RENDER ============ */

  if (!template || !session) {
    return <TemplateEditor onSave={handleTemplateSave} />;
  }

  return <WatchPage template={template} strips={strips} />;
}
