export type SessionStage = "IDLE" |"COLLECTING" | "READY" | "PRINTING" | "DONE"

export type StripTemplate = {
  id: string                // e.g. "classic-3"
  slots: number             // how many photos (3, 4, etc)

  canvas: {
    width: number           // px
    height: number          // px
    background: string      // color or image path
  }

  photo: {
    aspectRatio: number    // e.g. 2 / 3
    borderRadius: number   // px
  }

  layout: {
    padding: number        // px (outer margin)
    spacing: number        // px (between photos)
    align: "top" | "center"
  }
}
