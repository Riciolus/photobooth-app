export type SessionStage = "IDLE" | "COLLECTING" | "READY" | "PRINTING" | "DONE";

export type StripTemplate = {
  id: string;

  canvas: {
    width: number;
    height: number;
    backgroundImage: string; // path relatif / asset name
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
  backgroundImage: string | null;
  canvas: {
    width: number;
    height: number;
  };
  slots: PhotoSlot[] | [];
};
