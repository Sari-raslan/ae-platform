import { runtimeBus } from "../runtime/runtimeBus";
import { audioRuntime } from "../audio/audioRuntime";

export class ArrangerRuntime {
  constructor() {
    this.running = false;
    this.tempo = 120;
    this.currentChord = "C";
    this.step = 0;
    this.timer = null;
    this.pattern = [48, 55, 60, 64, 67, 64, 60, 55];
  }

  setTempo(tempo) {
    this.tempo = Math.max(40, Math.min(240, Number(tempo)));
    runtimeBus.emit("arranger:tempo", { tempo: this.tempo });

    if (this.running) {
      this.stop();
      this.start();
    }
  }

  setChord(chord) {
    this.currentChord = chord;
    runtimeBus.emit("arranger:chord", { chord });
  }

  transposeForChord(note) {
    const map = {
      C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11,
      Cm: 0, Dm: 2, Em: 4, Fm: 5, Gm: 7, Am: 9, Bm: 11
    };

    return note + (map[this.currentChord] || 0);
  }

  start() {
    if (this.running) return;

    this.running = true;
    this.step = 0;

    const interval = 60000 / this.tempo / 2;

    this.timer = setInterval(() => {
      const baseNote = this.pattern[this.step % this.pattern.length];
      const note = this.transposeForChord(baseNote);

      audioRuntime.noteOn(note, 80);
      setTimeout(() => audioRuntime.noteOff(note), interval * 0.7);

      runtimeBus.emit("arranger:step", {
        step: this.step,
        chord: this.currentChord,
        note,
        tempo: this.tempo
      });

      this.step++;
    }, interval);

    runtimeBus.emit("arranger:start", {
      tempo: this.tempo,
      chord: this.currentChord
    });
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    this.running = false;
    audioRuntime.panic();

    runtimeBus.emit("arranger:stop", {});
  }
}

export const arrangerRuntime = new ArrangerRuntime();
