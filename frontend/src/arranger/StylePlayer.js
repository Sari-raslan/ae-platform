import { workstation } from "../audio/WorkstationEngine";
import { factoryStylePack } from "../styles/FactoryStylePack";

export class StylePlayer {
  constructor() {
    this.styles = factoryStylePack;
    this.currentStyle = factoryStylePack.yamahaPop;
    this.sectionName = "MAIN_A";
    this.chord = "C";
    this.tempo = this.currentStyle.tempo;
    this.step = 0;
    this.timer = null;
    this.running = false;
    this.listeners = [];
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

  listStyles() {
    return Object.values(this.styles).map((style) => ({
      id: style.id,
      name: style.name,
      format: style.format,
      tempo: style.tempo,
      sections: Object.keys(style.sections)
    }));
  }

  loadStyle(id) {
    const next = Object.values(this.styles).find((s) => s.id === id);
    if (!next) return;

    this.stop();
    this.currentStyle = next;
    this.tempo = next.tempo;
    this.sectionName = Object.keys(next.sections)[0];
    this.step = 0;

    this.emit("style:loaded", this.status());
  }

  setSection(section) {
    if (!this.currentStyle.sections[section]) return;

    this.sectionName = section;
    this.step = 0;

    this.emit("style:section", this.status());
  }

  setChord(chord) {
    this.chord = chord;
    this.emit("style:chord", this.status());
  }

  setTempo(tempo) {
    this.tempo = Number(tempo);

    if (this.running) {
      this.stop();
      this.start();
    }

    this.emit("style:tempo", this.status());
  }

  transpose(note) {
    const rootMap = {
      C: 0,
      Cm: 0,
      D: 2,
      Dm: 2,
      E: 4,
      Em: 4,
      F: 5,
      Fm: 5,
      G: 7,
      Gm: 7,
      A: 9,
      Am: 9,
      B: 11,
      Bm: 11
    };

    const offset = rootMap[this.chord] ?? 0;
    const isMinor = this.chord.endsWith("m");

    let n = note + offset;

    if (isMinor && n % 12 === 4) {
      n -= 1;
    }

    return n;
  }

  async start() {
    await workstation.start();

    this.stop();

    const interval = 60000 / this.tempo / 2;
    this.running = true;

    this.timer = setInterval(() => {
      const section = this.currentStyle.sections[this.sectionName];
      if (!section) return;

      const tracks = section.tracks;

      Object.entries(tracks).forEach(([trackName, pattern]) => {
        const baseNote = pattern[this.step % pattern.length];

        if (trackName === "drums") {
          workstation.noteOn(baseNote, 70);
          setTimeout(() => workstation.noteOff(baseNote), interval * 0.3);
          return;
        }

        const note = this.transpose(baseNote);
        workstation.noteOn(note, trackName === "bass" ? 88 : 62);
        setTimeout(() => workstation.noteOff(note), interval * 0.65);
      });

      this.emit("style:step", {
        ...this.status(),
        step: this.step
      });

      this.step++;

      if (
        (this.sectionName.includes("INTRO") || this.sectionName.includes("FILL")) &&
        this.step >= Math.max(...Object.values(tracks).map((p) => p.length))
      ) {
        const fallback =
          this.currentStyle.sections.MAIN_A ? "MAIN_A" :
          this.currentStyle.sections.VAR_1 ? "VAR_1" :
          Object.keys(this.currentStyle.sections)[0];

        this.setSection(fallback);
      }

      if (
        this.sectionName.includes("ENDING") &&
        this.step >= Math.max(...Object.values(tracks).map((p) => p.length))
      ) {
        this.stop();
      }
    }, interval);

    this.emit("style:start", this.status());
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    this.running = false;
    workstation.panic();

    this.emit("style:stop", this.status());
  }

  status() {
    return {
      styleId: this.currentStyle.id,
      style: this.currentStyle.name,
      format: this.currentStyle.format,
      section: this.sectionName,
      chord: this.chord,
      tempo: this.tempo,
      running: this.running,
      step: this.step
    };
  }
}

export const stylePlayer = new StylePlayer();
