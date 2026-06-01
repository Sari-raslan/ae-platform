export class ArrangerCore {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.running = false;
    this.tempo = 110;
    this.section = "MAIN_A";
    this.chord = "C";
    this.step = 0;
    this.timer = null;
    this.listeners = [];

    this.patterns = {
      INTRO: [48,52,55,60],
      MAIN_A: [48,52,55,52,48,55,52,60],
      MAIN_B: [48,55,60,64,60,55,52,48],
      FILL: [60,62,64,65,67],
      ENDING: [60,55,52,48]
    };
  }

  on(cb) {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter((x) => x !== cb);
    };
  }

  emit(type, data = {}) {
    this.listeners.forEach((cb) =>
      cb({
        type,
        data,
        time: new Date().toISOString()
      })
    );
  }

  async startAudio() {
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.45;
      this.master.connect(this.ctx.destination);
    }

    if (this.ctx.state === "suspended") {
      await this.ctx.resume();
    }
  }

  freq(note) {
    return 440 * Math.pow(2, (note - 69) / 12);
  }

  rootOffset() {
    const map = {
      C: 0, "C#": 1, Db: 1,
      D: 2, "D#": 3, Eb: 3,
      E: 4,
      F: 5, "F#": 6, Gb: 6,
      G: 7, "G#": 8, Ab: 8,
      A: 9, "A#": 10, Bb: 10,
      B: 11
    };

    const root = this.chord.replace("maj7", "").replace("m7", "").replace("sus4", "").replace("7", "").replace("m", "");
    return map[root] || 0;
  }

  transpose(note) {
    let out = note + this.rootOffset();

    if (this.chord.includes("m") && !this.chord.includes("maj")) {
      if (out % 12 === 4) out -= 1;
    }

    if (this.chord.includes("sus4")) {
      if (out % 12 === 4) out += 1;
    }

    return out;
  }

  play(note, type = "sawtooth", duration = 0.18, volume = 0.12) {
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = type;
    osc.frequency.value = this.freq(note);

    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(this.master);

    osc.start(now);
    osc.stop(now + duration);
  }

  tick() {
    const pattern = this.patterns[this.section] || this.patterns.MAIN_A;
    const base = pattern[this.step % pattern.length];

    this.play(this.transpose(base - 12), "triangle", 0.22, 0.12);
    this.play(this.transpose(base), "sawtooth", 0.25, 0.08);
    this.play(36 + (this.step % 2) * 2, "square", 0.06, 0.05);

    this.emit("arranger:tick", this.status());

    this.step++;

    if ((this.section === "FILL" || this.section === "INTRO") && this.step >= pattern.length) {
      this.setSection("MAIN_A");
    }

    if (this.section === "ENDING" && this.step >= pattern.length) {
      this.stop();
    }
  }

  async start() {
    await this.startAudio();
    this.stop();

    this.running = true;
    const interval = 60000 / this.tempo / 2;

    this.timer = setInterval(() => this.tick(), interval);
    this.emit("arranger:start", this.status());
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    this.running = false;
    this.emit("arranger:stop", this.status());
  }

  setTempo(v) {
    this.tempo = Number(v);
    if (this.running) this.start();
  }

  setSection(section) {
    this.section = section;
    this.step = 0;
    this.emit("arranger:section", this.status());
  }

  setChord(chord) {
    if (!chord) return;
    this.chord = chord;
    this.emit("arranger:chord", this.status());
  }

  status() {
    return {
      running: this.running,
      tempo: this.tempo,
      section: this.section,
      chord: this.chord,
      step: this.step
    };
  }
}

export const arrangerCore = new ArrangerCore();
