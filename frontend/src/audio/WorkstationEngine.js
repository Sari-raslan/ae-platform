export class WorkstationEngine {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.filter = null;
    this.compressor = null;
    this.voices = new Map();
    this.samples = [];
    this.styleTimer = null;
    this.tempo = 110;
    this.styleStep = 0;
    this.pattern = [48, 55, 60, 64, 67, 64, 60, 55];
  }

  async start() {
    if (!this.ctx) {
      this.ctx = new AudioContext();

      this.master = this.ctx.createGain();
      this.master.gain.value = 0.45;

      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = "lowpass";
      this.filter.frequency.value = 9000;

      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.value = -18;
      this.compressor.ratio.value = 5;

      this.master.connect(this.filter);
      this.filter.connect(this.compressor);
      this.compressor.connect(this.ctx.destination);
    }

    if (this.ctx.state === "suspended") {
      await this.ctx.resume();
    }

    return this.status();
  }

  freq(note) {
    return 440 * Math.pow(2, (note - 69) / 12);
  }

  noteOn(note, velocity = 100) {
    if (!this.ctx) return;

    this.noteOff(note);

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.value = this.freq(note);

    const now = this.ctx.currentTime;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime((velocity / 127) * 0.25, now + 0.02);

    osc.connect(gain);
    gain.connect(this.master);
    osc.start(now);

    this.voices.set(note, { osc, gain });
  }

  noteOff(note) {
    if (!this.ctx) return;

    const voice = this.voices.get(note);
    if (!voice) return;

    const now = this.ctx.currentTime;
    voice.gain.gain.cancelScheduledValues(now);
    voice.gain.gain.setValueAtTime(Math.max(voice.gain.gain.value, 0.0001), now);
    voice.gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
    voice.osc.stop(now + 0.1);

    this.voices.delete(note);
  }

  panic() {
    Array.from(this.voices.keys()).forEach((n) => this.noteOff(n));
  }

  setVolume(v) {
    if (this.master) this.master.gain.value = Number(v);
  }

  setFilter(v) {
    if (this.filter) this.filter.frequency.value = Number(v);
  }

  addSample(name) {
    this.samples.push({
      name,
      time: new Date().toISOString()
    });
  }

  startStyle() {
    this.stopStyle();

    const interval = 60000 / this.tempo / 2;

    this.styleTimer = setInterval(() => {
      const note = this.pattern[this.styleStep % this.pattern.length];
      this.noteOn(note, 80);
      setTimeout(() => this.noteOff(note), interval * 0.7);
      this.styleStep++;
    }, interval);
  }

  stopStyle() {
    if (this.styleTimer) clearInterval(this.styleTimer);
    this.styleTimer = null;
    this.panic();
  }

  setTempo(v) {
    this.tempo = Number(v);
    if (this.styleTimer) this.startStyle();
  }

  status() {
    return {
      audio: this.ctx?.state || "not-started",
      sampleRate: this.ctx?.sampleRate || 0,
      voices: this.voices.size,
      samples: this.samples.length,
      tempo: this.tempo
    };
  }
}

export const workstation = new WorkstationEngine();
