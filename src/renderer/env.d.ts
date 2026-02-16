export {};

declare global {
  interface Window {
    api: {
      startSession: (template: StripTemplate) => void;
      onSessionUpdated: (callback: (state: SessionState) => void) => void;
      onStripReady: (cb: (strip: { index: number; path: string }) => void) => void;
      onPhotoAdded: (cb: (data: { path: string }) => void) => void;
      exportPaper: (data: ExportPaperPayload) => void;
      pickBackground: () => Promise<PickBackgroundResult>;
      pickPhoto(): Promise<{ path: string } | null>;
    };
  }
}
