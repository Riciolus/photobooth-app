export {}

declare global {
  interface Window {
    api: {
      startSession: () => Promise<void>
      onSessionUpdated: (callback: (state: SessionState) => void) => void
      onStripReady: (cb: (url: string) => void ) => void
    }
  }
}
