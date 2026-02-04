import { Session } from "./session";
import { StripTemplate } from "src/shared/types";

export type StripResult = {
  id: number;
  path: string;
};

export class PaperSession {
  private maxStrips: number;
  private template: StripTemplate;

  private currentSession: Session | null = null;
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

    this.currentSession = new Session(this.template);
  }

  addPhoto(path: string) {
    if (!this.currentSession) return;

    this.currentSession.addPhoto(path);
  }

  completeCurrentSession(renderedPath: string) {
    if (!this.currentSession || !this.currentSession.isReady()) {
      throw new Error("Current session not ready");
    }

    this.completedStrips.push({
      id: this.completedStrips.length + 1,
      path: renderedPath,
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
