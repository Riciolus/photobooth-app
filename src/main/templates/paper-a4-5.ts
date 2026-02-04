import { PaperTemplate } from "src/shared/paper";

export const A4_5_STRIPS: PaperTemplate = {
  id: "a4-5-strips",

  canvas: {
    width: 2480, // A4 @ 300dpi
    height: 3508,
    background: "#ffffff",
  },

  layout: {
    direction: "vertical",
    copies: 5,
    spacing: 40,
    align: "center",
    rotateStrip: 90,
  },
};
