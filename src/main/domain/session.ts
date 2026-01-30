import { SessionStage } from "src/shared/types"

export type StripTemplate = {
  slots: number
}

export class Session {
  private stage: SessionStage = "IDLE"
  private photos: string[] = []
  private template: StripTemplate
  constructor(template: StripTemplate) {
    this.template = template
  }

  addPhoto(path: string) {
  if (this.stage === "READY") return;

  if (this.stage === "IDLE") {
    this.stage = "COLLECTING";
  }

  this.photos.push(path);

  if (this.photos.length === this.template.slots) {
    this.stage = "READY";
    console.log("🎉 Session READY", this.photos);
  }
}


  isReady() {
    return this.stage === "READY"
  }

  getPhotos() {
    return [...this.photos]
  }

  getStage() {
    return this.stage
  }
}
