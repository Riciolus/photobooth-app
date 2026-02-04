import { StripTemplate } from "src/shared/types";
import TemplateEditor from "./pages/TemplateEditor";
import WatchPage from "./pages/WatchPage";
import { useState } from "react";

export default function App() {
  const [runtimeTemplate, setRuntimeTemplate] = useState<StripTemplate | null>(null);

  if (!runtimeTemplate) {
    return (
      <TemplateEditor
        onSave={(template) => {
          setRuntimeTemplate(template);
        }}
      />
    );
  }

  return <WatchPage template={runtimeTemplate} />;
}
