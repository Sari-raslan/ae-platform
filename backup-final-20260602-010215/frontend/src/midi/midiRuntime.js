import { runtimeBus } from "../runtime/runtimeBus";
import { audioRuntime } from "../audio/audioRuntime";

export class MidiRuntime {
  constructor() {
    this.access = null;
    this.inputs = [];
    this.outputs = [];
    this.activeNotes = new Set();
  }

  async init() {
    if (!navigator.requestMIDIAccess) {
      runtimeBus.emit("midi:unavailable", { reason: "Web MIDI API unavailable" });
      return false;
    }

    try {
      this.access = await navigator.requestMIDIAccess({ sysex: false });
      this.refreshDevices();
      this.access.onstatechange = () => this.refreshDevices();

      runtimeBus.emit("midi:ready", {
        inputs: this.inputs.length,
        outputs: this.outputs.length
      });

      return true;
    } catch (error) {
      runtimeBus.emit("midi:error", { message: error.message });
      return false;
    }
  }

  refreshDevices() {
    this.inputs = Array.from(this.access?.inputs?.values?.() || []);
    this.outputs = Array.from(this.access?.outputs?.values?.() || []);

    this.inputs.forEach((input) => {
      input.onmidimessage = (message) => this.handleMessage(message, input);
    });

    runtimeBus.emit("midi:devices", {
      inputs: this.inputs.map((d) => ({
        id: d.id,
        name: d.name,
        manufacturer: d.manufacturer,
        state: d.state
      })),
      outputs: this.outputs.map((d) => ({
        id: d.id,
        name: d.name,
        manufacturer: d.manufacturer,
        state: d.state
      }))
    });
  }

  handleMessage(message, input) {
    const [status, note, velocity] = message.data;
    const command = status & 0xf0;
    const channel = (status & 0x0f) + 1;

    if (command === 0x90 && velocity > 0) {
      this.activeNotes.add(note);
      audioRuntime.noteOn(note, velocity, "midi");
      runtimeBus.emit("midi:noteon", {
        input: input.name,
        channel,
        note,
        velocity,
        activeNotes: Array.from(this.activeNotes)
      });
    } else if (command === 0x80 || command === 0x90) {
      this.activeNotes.delete(note);
      audioRuntime.noteOff(note, "midi");
      runtimeBus.emit("midi:noteoff", {
        input: input.name,
        channel,
        note,
        velocity,
        activeNotes: Array.from(this.activeNotes)
      });
    } else {
      runtimeBus.emit("midi:message", {
        input: input.name,
        channel,
        data: Array.from(message.data)
      });
    }
  }

  simulateNote(note = 60, velocity = 100) {
    this.activeNotes.add(note);
    audioRuntime.noteOn(note, velocity, "sim");

    runtimeBus.emit("midi:noteon", {
      input: "Simulator",
      channel: 1,
      note,
      velocity,
      activeNotes: Array.from(this.activeNotes)
    });

    setTimeout(() => {
      this.activeNotes.delete(note);
      audioRuntime.noteOff(note, "sim");

      runtimeBus.emit("midi:noteoff", {
        input: "Simulator",
        channel: 1,
        note,
        velocity: 0,
        activeNotes: Array.from(this.activeNotes)
      });
    }, 350);
  }
}

export const midiRuntime = new MidiRuntime();
