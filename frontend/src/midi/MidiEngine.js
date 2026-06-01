import { audioDSP } from "../audio/AudioDSP";

export class MidiEngine {
  constructor() {
    this.access = null;
    this.inputs = [];
    this.outputs = [];
    this.listeners = [];
    this.activeNotes = new Set();
  }

  on(callback) {
    this.listeners.push(callback);

    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  emit(type, payload = {}) {
    const event = {
      type,
      payload,
      time: performance.now(),
      iso: new Date().toISOString()
    };

    this.listeners.forEach((cb) => cb(event));
  }

  async start() {
    await audioDSP.start();

    if (!navigator.requestMIDIAccess) {
      this.emit("midi:error", {
        message: "Web MIDI غير مدعوم"
      });

      return false;
    }

    this.access = await navigator.requestMIDIAccess({
      sysex: false
    });

    this.refreshDevices();

    this.access.onstatechange = () => {
      this.refreshDevices();
    };

    this.emit("midi:ready", {
      inputs: this.inputs.length,
      outputs: this.outputs.length
    });

    return true;
  }

  refreshDevices() {
    this.inputs = Array.from(this.access?.inputs?.values?.() || []);
    this.outputs = Array.from(this.access?.outputs?.values?.() || []);

    this.inputs.forEach((input) => {
      input.onmidimessage = (message) => {
        this.handleMessage(message, input);
      };
    });

    this.emit("midi:devices", {
      inputs: this.inputs.map((i) => ({
        id: i.id,
        name: i.name,
        manufacturer: i.manufacturer,
        state: i.state
      })),
      outputs: this.outputs.map((o) => ({
        id: o.id,
        name: o.name,
        manufacturer: o.manufacturer,
        state: o.state
      }))
    });
  }

  handleMessage(message, input) {
    const data = Array.from(message.data);
    const status = data[0];
    const command = status & 0xf0;
    const channel = (status & 0x0f) + 1;
    const note = data[1];
    const velocity = data[2];

    if (command === 0x90 && velocity > 0) {
      this.activeNotes.add(note);
      audioDSP.noteOn(note, velocity);

      this.emit("midi:noteon", {
        input: input.name,
        channel,
        note,
        velocity,
        activeNotes: Array.from(this.activeNotes)
      });

      return;
    }

    if (command === 0x80 || command === 0x90) {
      this.activeNotes.delete(note);
      audioDSP.noteOff(note);

      this.emit("midi:noteoff", {
        input: input.name,
        channel,
        note,
        velocity,
        activeNotes: Array.from(this.activeNotes)
      });

      return;
    }

    if (command === 0xb0) {
      this.emit("midi:cc", {
        input: input.name,
        channel,
        controller: data[1],
        value: data[2]
      });

      return;
    }

    if (command === 0xe0) {
      const value = ((data[2] << 7) | data[1]) - 8192;

      this.emit("midi:pitchbend", {
        input: input.name,
        channel,
        value
      });

      return;
    }

    this.emit("midi:message", {
      input: input.name,
      channel,
      data
    });
  }

  testNote(note = 60) {
    audioDSP.noteOn(note, 100);

    this.emit("midi:test-noteon", {
      note
    });

    setTimeout(() => {
      audioDSP.noteOff(note);

      this.emit("midi:test-noteoff", {
        note
      });
    }, 400);
  }

  panic() {
    audioDSP.panic();
    this.activeNotes.clear();

    this.emit("midi:panic", {});
  }
}

export const midiEngine = new MidiEngine();
