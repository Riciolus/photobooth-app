import { StripTemplate } from "src/shared/types";

export const CLASSIC_3_TEMPLATE: StripTemplate = {
  id: "classic-3",
  slots: 3,

  canvas: {
    width: 600,
    height: 1800,
    background: "#ffffff",
  },

  photo: {
    aspectRatio: 2 / 3,
    borderRadius: 0,
  },

  layout: {
    padding: 40,
    spacing: 30,
    align: "top",
  },
}
