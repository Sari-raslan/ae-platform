export class AudioEngine {
  constructor() { this.context = null; }
  async initialize() {
    this.context = new AudioContext();
    if (this.context.state === "suspended") await this.context.resume();
    return { ok: true, sampleRate: this.context.sampleRate, state: this.context.state };
  }
}
