import { runtimeBus } from "../runtime/runtimeBus";
import { audioRuntime } from "../audio/audioRuntime";
import { factoryStyles } from "../styles/factoryStyles";

export class StyleEngine {
  constructor() {
    this.style = factoryStyles.pop8beat;
    this.section = "VAR1";
    this.chord = "C";
    this.tempo = this.style.tempo;
    this.running = false;
    this.step = 0;
    this.timer = null;
  }

  listStyles() {
    return Object.values(factoryStyles).map((s) => ({
      id: s.id,
      name: s.name,
      tempo: s.tempo,
      sections: Object.keys(s.sections)
    }));
  }

  loadStyle(styleId) {
    const next = factoryStyles[styleId];
    if (!next) return false;

    this.stop();
    this.style = next;
    this.tempo = next.tempo;
    this.section = "VAR1";
    this.step = 0;

    runtimeBus.emit("style:loaded", {
      style: this.style.name,
      tempo: this.tempo
    });

    return true;
  }

  setSection(section) {
    if (!this.style.sections[section]) return false;

    this.section = section;
    this.step = 0;

    runtimeBus.emit("style:section", {
      section
    });

    return true;
  }

  setChord(chord) {
    this.chord = chord;

    runtimeBus.emit("style:chord", {
      chord
    });
  }

  setTempo(tempo) {
    this.tempo = Math.max(40, Math.min(240, Number(tempo)));

    runtimeBus.emit("style:tempo", {
      tempo: this.tempo
    });

    if (this.running) {
      this.stop();
      this.start();
    }
  }

  transpose(note) {
    const rootMap = {
      C: 0, Cm: 0,
      D: 2, Dm: 2,
      E: 4, Em: 4,
      F: 5, Fm: 5,
      G: 7, Gm: 7,
      A: 9, Am: 9,
      B: 11, Bm: 11
    };

    const offset = rootMap[this.chord] ?? 0;
    const minor = this.chord.endsWith("m");

    let transposed = note + offset;

    if (minor) {
      const degree = transposed % 12;
      if (degree === 4) transposed -= 1;
    }

    return transposed;
  }

  start() {
    if (this.running) return;

    this.running = true;
    this.step = 0;

    const interval = 60000 / this.tempo / 2;

    this.timer = setInterval(() => {
      const pattern = this.style.sections[this.section] || [];
      if (!pattern.length) return;

      const baseNote = pattern[this.step % pattern.length];
      const note = this.transpose(baseNote);

      audioRuntime.noteOn(note, 85);
      setTimeout(() => audioRuntime.noteOff(note), interval * 0.7);

      runtimeBus.emit("style:step", {
        style: this.style.name,
        section: this.section,
        chord: this.chord,
        step: this.step,
        note,
        tempo: this.tempo
      });

      this.step++;

      if (
        (this.section === "INTRO1" || this.section === "FILL1") &&
        this.step >= pattern.length
      ) {
        this.setSection("VAR1");
      }

      if (this.section === "ENDING1" && this.step >= pattern.length) {
        this.stop();
      }
    }, interval);

    runtimeBus.emit("style:start", {
      style: this.style.name,
      section: this.section,
      tempo: this.tempo
    });
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    this.running = false;
    audioRuntime.panic();

    runtimeBus.emit("style:stop", {});
  }

  getStatus() {
    return {
      style: this.style.name,
      styleId: this.style.id,
      section: this.section,
      chord: this.chord,
      tempo: this.tempo,
      running: this.running,
      step: this.step
    };
  }
}

export const styleEngine = new StyleEngine();
