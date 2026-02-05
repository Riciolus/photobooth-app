import { SessionStage, StripTemplate } from "src/shared/types";

export class StripSession {
  private stage: SessionStage = "IDLE";
  private photos: string[] = [];
  private template: StripTemplate;

  constructor(template: StripTemplate) {
    this.template = template;
  }

  addPhoto(path: string) {
    if (!this.template.photoSlots) {
      throw new Error("Template.photoSlots is missing");
    }

    if (this.stage === "READY") return;

    if (this.stage === "IDLE") {
      this.stage = "COLLECTING";
    }

    this.photos.push(path);

    if (this.photos.length === this.template.photoSlots.length) {
      this.stage = "READY";
      console.log("🎉 StripSession READY", this.photos);
    }
  }

  getStage() {
    return this.stage;
  }

  getPhotos() {
    return [...this.photos];
  }

  getTemplate() {
    return this.template;
  }

  isReady() {
    return this.stage === "READY";
  }

  reset() {
    this.stage = "IDLE";
    this.photos = [];
  }
}
