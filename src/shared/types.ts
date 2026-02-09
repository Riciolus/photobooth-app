export type SessionStage = "IDLE" | "COLLECTING" | "READY" | "PRINTING" | "DONE";

export type ImageSource = {
  path: string; // filesystem path (WAJIB untuk render)
  preview: string; // blob:// atau strip:// untuk UI
};

export type StripTemplate = {
  id: string;

  canvas: {
    width: number;
    height: number;
    background: ImageSource;
  };

  photoSlots: PhotoSlot[];
};

export type PhotoSlot = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type EditableTemplate = {
  canvas: {
    width: number;
    height: number;
    background: ImageSource;
  };
  slots: PhotoSlot[] | [];
};
