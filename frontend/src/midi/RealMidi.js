import { workstation } from "../audio/WorkstationEngine";

export class RealMidi {
  constructor() {
    this.access = null;
    this.inputs = [];
    this.outputs = [];
    this.listeners = [];
    this.activeNotes = [];
  }

  on(cb) {
    this.listeners.push(cb);
    return () => this.listeners = this.listeners.filter(x => x !== cb);
  }

  emit(type, data = {}) {
    this.listeners.forEach(cb => cb({ type, data, time: new Date().toISOString() }));
  }

  async start() {
    await workstation.start();

    if (!navigator.requestMIDIAccess) {
      this.emit("error", { message: "Web MIDI not available" });
      return false;
    }

    this.access = await navigator.requestMIDIAccess({ sysex: false });
    this.refresh();

    this.access.onstatechange = () => this.refresh();

    this.emit("ready", {
      inputs: this.inputs.length,
      outputs: this.outputs.length
    });

    return true;
  }

  refresh() {
    this.inputs = Array.from(this.access?.inputs?.values?.() || []);
    this.outputs = Array.from(this.access?.outputs?.values?.() || []);

    this.inputs.forEach(input => {
      input.onmidimessage = msg => this.handle(msg, input);
    });

    this.emit("devices", {
      inputs: this.inputs.map(i => i.name),
      outputs: this.outputs.map(o => o.name)
    });
  }

  handle(msg, input) {
    const d = Array.from(msg.data);
    const status = d[0];
    const cmd = status & 0xf0;
    const ch = (status & 0x0f) + 1;
    const note = d[1];
    const vel = d[2];

    if (cmd === 0x90 && vel > 0) {
      workstation.noteOn(note, vel);
      this.activeNotes = [...new Set([...this.activeNotes, note])];
      this.emit("noteon", { input: input.name, ch, note, vel, active: this.activeNotes });
      return;
    }

    if (cmd === 0x80 || cmd === 0x90) {
      workstation.noteOff(note);
      this.activeNotes = this.activeNotes.filter(n => n !== note);
      this.emit("noteoff", { input: input.name, ch, note, vel, active: this.activeNotes });
      return;
    }

    if (cmd === 0xb0) {
      this.emit("cc", { input: input.name, ch, cc: d[1], value: d[2] });
      return;
    }

    if (cmd === 0xe0) {
      this.emit("pitchbend", { input: input.name, ch, value: ((d[2] << 7) | d[1]) - 8192 });
      return;
    }

    this.emit("message", { input: input.name, data: d });
  }

  test(note) {
    workstation.noteOn(note, 100);
    this.emit("test-noteon", { note });
    setTimeout(() => {
      workstation.noteOff(note);
      this.emit("test-noteoff", { note });
    }, 350);
  }

  panic() {
    workstation.panic();
    this.activeNotes = [];
    this.emit("panic", {});
  }
}

export const realMidi = new RealMidi();
