export class AudioEngine {
  constructor() {
    this.context = null;
    this.master = null;
    this.voices = new Map();
  }

  async start() {
    if (!this.context) {
      this.context = new AudioContext();
      this.master = this.context.createGain();
      this.master.gain.value = 0.4;
      this.master.connect(this.context.destination);
    }

    if (this.context.state === "suspended") {
      await this.context.resume();
    }

    return {
      ok: true,
      state: this.context.state,
      sampleRate: this.context.sampleRate
    };
  }

  noteToFreq(note) {
    return 440 * Math.pow(2, (note - 69) / 12);
  }

  noteOn(note, velocity = 100) {
    if (!this.context || !this.master) return;

    const id = String(note);

    this.noteOff(note);

    const osc = this.context.createOscillator();
    const gain = this.context.createGain();

    osc.type = "sawtooth";
    osc.frequency.value = this.noteToFreq(note);

    const now = this.context.currentTime;
    const level = Math.max(0.03, Math.min(1, velocity / 127)) * 0.25;

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(level, now + 0.02);

    osc.connect(gain);
    gain.connect(this.master);

    osc.start(now);

    this.voices.set(id, { osc, gain });
  }

  noteOff(note) {
    if (!this.context) return;

    const id = String(note);
    const voice = this.voices.get(id);

    if (!voice) return;

    const now = this.context.currentTime;

    voice.gain.gain.cancelScheduledValues(now);
    voice.gain.gain.setValueAtTime(Math.max(voice.gain.gain.value, 0.0001), now);
    voice.gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

    voice.osc.stop(now + 0.1);

    this.voices.delete(id);
  }

  panic() {
    for (const note of Array.from(this.voices.keys())) {
      this.noteOff(Number(note));
    }
  }

  status() {
    return {
      state: this.context?.state || "not-started",
      sampleRate: this.context?.sampleRate || 0,
      activeVoices: this.voices.size
    };
  }
}

export const audioEngine = new AudioEngine();
