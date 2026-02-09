import { StripTemplate } from "./types";

export type PhotoAsset = {
  path: string; // filesystem path (render)
  preview: string; // blob URL (UI)
};

export type StripPreviewState = {
  photos: PhotoAsset[];
};

export type ExportPaperPayload = {
  template: StripTemplate;
  strips: StripPreviewState[];
};
