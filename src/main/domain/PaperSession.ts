import { StripSession } from "../../shared/domain/StripSession";
import { StripTemplate } from "../../shared/types";

export type StripResult = {
  id: number;
  path: string;
};

type CompletedStrip = {
  photos: string[];
};

export class PaperSession {
  private maxStrips: number;
  private template: StripTemplate;

  private currentSession: StripSession | null = null;
  private completedStrips: StripResult[] = [];

  constructor(template: StripTemplate, maxStrips = 5) {
    this.template = template;
    this.maxStrips = maxStrips;
    this.startNewSession();
  }

  private startNewSession() {
    if (this.completedStrips.length >= this.maxStrips) {
      this.currentSession = null;
      return;
    }

    this.currentSession = new StripSession(this.template);
  }

  addPhoto(path: string) {
    if (!this.currentSession) return;

    this.currentSession.addPhoto(path);
  }

  completeCurrentSession(path: string) {
    this.completedStrips.push({
      id: this.completedStrips.length + 1,
      path,
    });

    this.startNewSession();
  }

  getCurrentSession() {
    return this.currentSession;
  }

  getCompletedStrips() {
    return [...this.completedStrips];
  }

  isPaperReady() {
    return this.completedStrips.length === this.maxStrips;
  }

  reset() {
    this.completedStrips = [];
    this.startNewSession();
  }
}
