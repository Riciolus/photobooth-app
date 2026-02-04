export type PaperTemplate = {
  id: string;

  canvas: {
    width: number;
    height: number;
    background: string;
  };

  layout: {
    direction: "vertical" | "horizontal";
    copies: number;
    spacing: number;
    align: "center" | "start";
    rotateStrip: number;
  };
};
