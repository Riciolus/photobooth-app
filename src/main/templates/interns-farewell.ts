import { StripTemplate } from "src/shared/types";
import path from "path";

export const INTERNS_FAREWELL_TEMPLATE: StripTemplate = {
  id: "interns-farewell",
  name: "Interns Farewell",

  slots: 3,

  background: {
    imagePath: path.join(__dirname, "../../assets/templates/interns-farewell.png"),
    width: 1200,
    height: 3600,
  },

  photoSlots: [
    {
      x: 120,
      y: 260,
      width: 960,
      height: 720,
    },
    {
      x: 120,
      y: 1120,
      width: 960,
      height: 720,
    },
    {
      x: 120,
      y: 1980,
      width: 960,
      height: 720,
    },
  ],
};
