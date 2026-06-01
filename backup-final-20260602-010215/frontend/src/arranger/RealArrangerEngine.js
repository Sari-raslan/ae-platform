export class RealArrangerEngine {
  constructor() {
    this.ctx = null;
    this.master = null;

    this.running = false;
    this.currentChord = "C";
    this.currentSection = "MAIN_A";
    this.currentVariation = "A";
    this.tempo = 110;

    this.step = 0;
    this.timer = null;

    this.style = this.createDefaultStyle();

    this.listeners = [];
  }

  createDefaultStyle() {
    return {
      name: "UAOS Factory Style",
      sections: {
        INTRO: {
          drums: [36,42,38,42],
          bass: [36,36,43,43],
          chord: [48,52,55,60]
        },

        MAIN_A: {
          drums: [36,42,38,42,36,42,38,46],
          bass: [36,36,43,43,48,48,43,43],
          chord: [48,52,55,60,55,52,48,52]
        },

        MAIN_B: {
          drums: [36,42,38,46,36,42,38,42],
          bass: [36,43,48,43,36,43,48,55],
          chord: [48,55,60,64,60,55,52,48]
        },

        FILL: {
          drums: [38,38,42,46,36,38,42,49],
          bass: [36,43,48,55],
          chord: [60,64,67,72]
        },

        ENDING: {
          drums: [36,42,38,49],
          bass: [36,31,28,24],
          chord: [60,55,52,48]
        }
      }
    };
  }

  on(cb) {
    this.listeners.push(cb);

    return () => {
      this.listeners = this.listeners.filter(x => x !== cb);
    };
  }

  emit(type, data = {}) {
    this.listeners.forEach(cb =>
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
      this.master.gain.value = 0.5;

      this.master.connect(this.ctx.destination);
    }

    if (this.ctx.state === "suspended") {
      await this.ctx.resume();
    }
  }

  noteFreq(note) {
    return 440 * Math.pow(2, (note - 69) / 12);
  }

  playSynth(note, type = "sawtooth", duration = 0.2, volume = 0.15) {
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.value = this.noteFreq(note);

    const now = this.ctx.currentTime;

    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      now + duration
    );

    osc.connect(gain);
    gain.connect(this.master);

    osc.start(now);
    osc.stop(now + duration);
  }

  transpose(note) {
    const roots = {
      C:0,
      Dm:2,
      Em:4,
      F:5,
      G:7,
      Am:9,
      B:11
    };

    return note + (roots[this.currentChord] || 0);
  }

  playStep() {
    const sec = this.style.sections[this.currentSection];

    if (!sec) return;

    const i = this.step % sec.drums.length;

    const drum = sec.drums[i % sec.drums.length];
    const bass = sec.bass[i % sec.bass.length];
    const chord = sec.chord[i % sec.chord.length];

    this.playSynth(drum, "square", 0.08, 0.08);
    this.playSynth(this.transpose(bass), "triangle", 0.22, 0.12);
    this.playSynth(this.transpose(chord), "sawtooth", 0.3, 0.09);

    this.emit("arranger:step", {
      section: this.currentSection,
      chord: this.currentChord,
      step: this.step
    });

    this.step++;
  }

  async start() {
    await this.startAudio();

    this.stop();

    const interval = 60000 / this.tempo / 2;

    this.running = true;

    this.timer = setInterval(() => {
      this.playStep();
    }, interval);

    this.emit("arranger:start", {
      tempo: this.tempo
    });
  }

  stop() {
    if (this.timer) clearInterval(this.timer);

    this.timer = null;
    this.running = false;

    this.emit("arranger:stop", {});
  }

  setTempo(v) {
    this.tempo = Number(v);

    if (this.running) {
      this.start();
    }
  }

  setChord(chord) {
    this.currentChord = chord;

    this.emit("arranger:chord", {
      chord
    });
  }

  setSection(section) {
    this.currentSection = section;

    this.emit("arranger:section", {
      section
    });
  }

  loadStyle(style) {
    this.style = style;

    this.emit("arranger:style", {
      style: style.name
    });
  }

  status() {
    return {
      running: this.running,
      tempo: this.tempo,
      chord: this.currentChord,
      section: this.currentSection,
      step: this.step,
      style: this.style.name
    };
  }
}

export const arrangerEngine = new RealArrangerEngine();
