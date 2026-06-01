import { arrangerCore } from "../arranger/ArrangerCore";
import { chordDetector } from "./ChordDetector";

export class MidiArrangerInput {
  constructor() {
    this.access = null;
    this.inputs = [];
    this.outputs = [];
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

  async start() {
    await arrangerCore.startAudio();

    if (!navigator.requestMIDIAccess) {
      this.emit("midi:error", {
        message: "Web MIDI not available"
      });
      return false;
    }

    this.access = await navigator.requestMIDIAccess({
      sysex: false
    });

    this.refresh();

    this.access.onstatechange = () => this.refresh();

    this.emit("midi:ready", {
      inputs: this.inputs.length,
      outputs: this.outputs.length
    });

    return true;
  }

  refresh() {
    this.inputs = Array.from(this.access?.inputs?.values?.() || []);
    this.outputs = Array.from(this.access?.outputs?.values?.() || []);

    this.inputs.forEach((input) => {
      input.onmidimessage = (msg) => this.handle(msg, input);
    });

    this.emit("midi:devices", {
      inputs: this.inputs.map((i) => i.name),
      outputs: this.outputs.map((o) => o.name)
    });
  }

  handle(msg, input) {
    const d = Array.from(msg.data);
    const status = d[0];
    const cmd = status & 0xf0;
    const note = d[1];
    const velocity = d[2];

    if (cmd === 0x90 && velocity > 0) {
      const chord = chordDetector.noteOn(note);

      if (chord) arrangerCore.setChord(chord);

      this.emit("midi:noteon", {
        input: input.name,
        note,
        velocity,
        chord,
        detector: chordDetector.status()
      });

      return;
    }

    if (cmd === 0x80 || cmd === 0x90) {
      const chord = chordDetector.noteOff(note);

      if (chord) arrangerCore.setChord(chord);

      this.emit("midi:noteoff", {
        input: input.name,
        note,
        velocity,
        chord,
        detector: chordDetector.status()
      });

      return;
    }

    if (cmd === 0xb0) {
      this.emit("midi:cc", {
        input: input.name,
        cc: d[1],
        value: d[2]
      });
      return;
    }

    this.emit("midi:message", {
      input: input.name,
      data: d
    });
  }
}

export const midiArrangerInput = new MidiArrangerInput();
