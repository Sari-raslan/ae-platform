export class MasterEngine {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.filter = null;
    this.voices = new Map();
    this.samples = [];
    this.events = [];
    this.tempo = 112;
    this.step = 0;
    this.running = false;
    this.recording = false;
    this.section = "MAIN_A";
    this.chord = "C";
    this.timer = null;
    this.listeners = [];

    this.sections = {
      INTRO: [48,52,55,60,55,52,48,43],
      MAIN_A: [48,52,55,52,48,55,52,60],
      MAIN_B: [48,55,60,64,60,55,52,48],
      FILL: [60,62,64,65,67,69,71,72],
      ENDING: [60,55,52,48,43,40,36,36]
    };
  }

  on(cb) {
    this.listeners.push(cb);
    return () => this.listeners = this.listeners.filter(x => x !== cb);
  }

  emit(type, data = {}) {
    const e = { type, data, time: new Date().toISOString() };
    this.events.unshift(e);
    this.events = this.events.slice(0, 100);
    this.listeners.forEach(cb => cb(e));
  }

  async startAudio() {
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.45;

      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = "lowpass";
      this.filter.frequency.value = 9000;

      this.master.connect(this.filter);
      this.filter.connect(this.ctx.destination);
    }

    if (this.ctx.state === "suspended") {
      await this.ctx.resume();
    }

    this.emit("audio:ready", this.status());
  }

  freq(note) {
    return 440 * Math.pow(2, (note - 69) / 12);
  }

  rootOffset() {
    const m = { C:0, D:2, Dm:2, E:4, Em:4, F:5, G:7, A:9, Am:9, B:11 };
    return m[this.chord] || 0;
  }

  transpose(note) {
    let n = note + this.rootOffset();
    if (this.chord.includes("m") && n % 12 === 4) n -= 1;
    return n;
  }

  noteOn(note, velocity = 100, type = "sawtooth") {
    if (!this.ctx) return;

    this.noteOff(note);

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = type;
    osc.frequency.value = this.freq(note);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime((velocity / 127) * 0.25, now + 0.02);

    osc.connect(gain);
    gain.connect(this.master);

    osc.start(now);

    this.voices.set(note, { osc, gain });

    if (this.recording) {
      this.events.unshift({ type: "record:noteon", data: { note, velocity, step: this.step }, time: new Date().toISOString() });
    }
  }

  noteOff(note) {
    if (!this.ctx) return;
    const v = this.voices.get(note);
    if (!v) return;

    const now = this.ctx.currentTime;
    v.gain.gain.cancelScheduledValues(now);
    v.gain.gain.setValueAtTime(Math.max(v.gain.gain.value, 0.0001), now);
    v.gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
    v.osc.stop(now + 0.1);

    this.voices.delete(note);
  }

  panic() {
    Array.from(this.voices.keys()).forEach(n => this.noteOff(n));
    this.emit("panic", {});
  }

  tick() {
    const pattern = this.sections[this.section] || this.sections.MAIN_A;
    const base = pattern[this.step % pattern.length];

    this.noteOn(36 + (this.step % 2) * 2, 45, "square");
    setTimeout(() => this.noteOff(36 + (this.step % 2) * 2), 60);

    this.noteOn(this.transpose(base - 12), 90, "triangle");
    setTimeout(() => this.noteOff(this.transpose(base - 12)), 220);

    this.noteOn(this.transpose(base), 70, "sawtooth");
    setTimeout(() => this.noteOff(this.transpose(base)), 260);

    this.emit("arranger:tick", this.status());

    this.step++;

    if (this.section === "INTRO" && this.step >= pattern.length) this.setSection("MAIN_A");
    if (this.section === "FILL" && this.step >= pattern.length) this.setSection("MAIN_A");
    if (this.section === "ENDING" && this.step >= pattern.length) this.stopArranger();
  }

  async startArranger() {
    await this.startAudio();
    this.stopArranger(false);

    this.running = true;
    const interval = 60000 / this.tempo / 2;
    this.timer = setInterval(() => this.tick(), interval);

    this.emit("arranger:start", this.status());
  }

  stopArranger(emit = true) {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    this.running = false;
    this.panic();
    if (emit) this.emit("arranger:stop", this.status());
  }

  setTempo(v) {
    this.tempo = Number(v);
    if (this.running) this.startArranger();
    this.emit("tempo:set", this.status());
  }

  setChord(c) {
    this.chord = c;
    this.emit("chord:set", this.status());
  }

  setSection(s) {
    this.section = s;
    this.step = 0;
    this.emit("section:set", this.status());
  }

  setVolume(v) {
    if (this.master) this.master.gain.value = Number(v);
  }

  setFilter(v) {
    if (this.filter) this.filter.frequency.value = Number(v);
  }

  async loadSample(file) {
    await this.startAudio();
    const ab = await file.arrayBuffer();
    const buffer = await this.ctx.decodeAudioData(ab);

    const sample = {
      id: crypto.randomUUID(),
      name: file.name,
      duration: buffer.duration,
      buffer
    };

    this.samples.push(sample);
    this.emit("sample:loaded", { name: file.name });
    return sample;
  }

  playSample(id, pitch = 1) {
    const s = this.samples.find(x => x.id === id);
    if (!s || !this.ctx) return;

    const src = this.ctx.createBufferSource();
    const gain = this.ctx.createGain();

    src.buffer = s.buffer;
    src.playbackRate.value = pitch;
    gain.gain.value = 0.8;

    src.connect(gain);
    gain.connect(this.master);
    src.start();

    this.emit("sample:play", { name: s.name, pitch });
  }

  startRecord() {
    this.recording = true;
    this.emit("record:start", {});
  }

  stopRecord() {
    this.recording = false;
    this.emit("record:stop", {});
  }

  exportProject() {
    return {
      version: "6.0.0",
      tempo: this.tempo,
      section: this.section,
      chord: this.chord,
      samples: this.samples.map(s => ({ name: s.name, duration: s.duration })),
      events: this.events,
      exportedAt: new Date().toISOString()
    };
  }

  status() {
    return {
      audio: this.ctx?.state || "not-started",
      sampleRate: this.ctx?.sampleRate || 0,
      tempo: this.tempo,
      step: this.step,
      running: this.running,
      recording: this.recording,
      section: this.section,
      chord: this.chord,
      voices: this.voices.size,
      samples: this.samples.map(s => ({ id: s.id, name: s.name, duration: s.duration })),
      events: this.events
    };
  }
}

export const masterEngine = new MasterEngine();
