export {};

declare global {
  interface Window {
    api: {
      startSession: () => Promise<void>;
      onSessionUpdated: (callback: (state: SessionState) => void) => void;
      onStripReady: (cb: (strip: { index: number; path: string }) => void) => void;
    };
  }
}
