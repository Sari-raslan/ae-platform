export class AdvancedArrangerEngine {
  constructor() {
    this.ctx = null;
    this.master = null;

    this.running = false;
    this.tempo = 112;
    this.chord = "C";
    this.section = "MAIN_A";
    this.nextSection = null;
    this.step = 0;
    this.bar = 0;
    this.timer = null;
    this.listeners = [];

    this.style = {
      name: "UAOS Advanced Factory Style",
      sections: {
        INTRO_1: {
          autoNext: "MAIN_A",
          length: 8,
          bass: [36,36,43,43,48,48,43,36],
          chord: [48,52,55,60,55,52,48,55],
          drums: [36,42,38,42,36,42,38,49]
        },
        MAIN_A: {
          length: 8,
          bass: [36,36,43,43,48,48,43,43],
          chord: [48,52,55,52,48,52,55,60],
          drums: [36,42,38,42,36,42,38,46]
        },
        MAIN_B: {
          length: 8,
          bass: [36,43,48,43,36,43,48,55],
          chord: [48,55,60,64,60,55,52,48],
          drums: [36,42,38,46,36,42,38,46]
        },
        FILL_A: {
          autoNext: "MAIN_A",
          length: 4,
          bass: [36,43,48,55],
          chord: [60,62,64,67],
          drums: [38,40,42,49]
        },
        FILL_B: {
          autoNext: "MAIN_B",
          length: 4,
          bass: [36,40,43,48],
          chord: [55,57,60,64],
          drums: [38,42,46,49]
        },
        BREAK: {
          autoNext: "MAIN_A",
          length: 2,
          bass: [36,36],
          chord: [48,55],
          drums: [49,49]
        },
        ENDING_1: {
          autoStop: true,
          length: 8,
          bass: [48,43,40,36,31,28,24,24],
          chord: [60,55,52,48,43,40,36,36],
          drums: [36,42,38,42,36,38,49,36]
        }
      }
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
    const roots = {
      C: 0, D: 2, Dm: 2, E: 4, Em: 4, F: 5, G: 7, A: 9, Am: 9, B: 11
    };

    const root = this.chord.replace("m", "").replace("7", "");
    return roots[root] || 0;
  }

  transpose(note) {
    let n = note + this.rootOffset();

    if (this.chord.includes("m") && n % 12 === 4) {
      n -= 1;
    }

    return n;
  }

  play(note, type, duration, volume) {
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
    const sec = this.style.sections[this.section];
    if (!sec) return;

    const i = this.step % sec.length;

    const drum = sec.drums[i % sec.drums.length];
    const bass = sec.bass[i % sec.bass.length];
    const chord = sec.chord[i % sec.chord.length];

    this.play(drum, "square", 0.06, 0.05);
    this.play(this.transpose(bass), "triangle", 0.22, 0.13);
    this.play(this.transpose(chord), "sawtooth", 0.26, 0.08);

    this.emit("arranger:tick", this.status());

    this.step++;

    if (this.step % 8 === 0) {
      this.bar++;
      this.emit("arranger:bar", this.status());
    }

    if (this.step >= sec.length) {
      if (sec.autoStop) {
        this.stop();
        return;
      }

      if (sec.autoNext) {
        this.setSection(sec.autoNext);
        return;
      }

      if (this.nextSection) {
        const next = this.nextSection;
        this.nextSection = null;
        this.setSection(next);
      }

      this.step = 0;
    }
  }

  async start() {
    await this.startAudio();

    this.stop(false);

    this.running = true;

    const interval = 60000 / this.tempo / 2;

    this.timer = setInterval(() => this.tick(), interval);

    this.emit("arranger:start", this.status());
  }

  stop(emit = true) {
    if (this.timer) clearInterval(this.timer);

    this.timer = null;
    this.running = false;

    if (emit) {
      this.emit("arranger:stop", this.status());
    }
  }

  setTempo(v) {
    this.tempo = Number(v);

    if (this.running) {
      this.start();
    }

    this.emit("arranger:tempo", this.status());
  }

  setChord(chord) {
    this.chord = chord;
    this.emit("arranger:chord", this.status());
  }

  setSection(section) {
    if (!this.style.sections[section]) return;

    this.section = section;
    this.step = 0;

    this.emit("arranger:section", this.status());
  }

  queueSection(section) {
    if (!this.style.sections[section]) return;

    this.nextSection = section;

    this.emit("arranger:queue", {
      nextSection: section
    });
  }

  intro() {
    this.setSection("INTRO_1");
    this.start();
  }

  mainA() {
    this.queueSection("MAIN_A");
  }

  mainB() {
    this.queueSection("MAIN_B");
  }

  fillA() {
    this.setSection("FILL_A");
  }

  fillB() {
    this.setSection("FILL_B");
  }

  break() {
    this.setSection("BREAK");
  }

  ending() {
    this.setSection("ENDING_1");
  }

  status() {
    return {
      running: this.running,
      tempo: this.tempo,
      chord: this.chord,
      section: this.section,
      nextSection: this.nextSection,
      step: this.step,
      bar: this.bar,
      style: this.style.name
    };
  }
}

export const advancedArranger = new AdvancedArrangerEngine();
