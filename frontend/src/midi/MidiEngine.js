export class MidiEngine {
  constructor() {
    this.midiAccess = null;
    this.inputs = [];
    this.outputs = [];
    this.listeners = [];
    this.activeNotes = new Set();
  }

  onEvent(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  emit(type, data = {}) {
    const event = {
      type,
      data,
      time: performance.now(),
      iso: new Date().toISOString()
    };

    this.listeners.forEach((cb) => cb(event));
    return event;
  }

  async initialize() {
    if (!navigator.requestMIDIAccess) {
      this.emit("midi:error", {
        message: "Web MIDI API غير متوفر في هذا النظام"
      });
      return false;
    }

    try {
      this.midiAccess = await navigator.requestMIDIAccess({
        sysex: false
      });

      this.refreshDevices();

      this.midiAccess.onstatechange = () => {
        this.refreshDevices();
      };

      this.emit("midi:ready", {
        inputs: this.inputs.length,
        outputs: this.outputs.length
      });

      return true;
    } catch (error) {
      this.emit("midi:error", {
        message: error.message
      });
      return false;
    }
  }

  refreshDevices() {
    this.inputs = Array.from(this.midiAccess.inputs.values());
    this.outputs = Array.from(this.midiAccess.outputs.values());

    this.inputs.forEach((input) => {
      input.onmidimessage = (message) => {
        this.handleMidiMessage(message, input);
      };
    });

    this.emit("midi:devices", {
      inputs: this.inputs.map((input) => ({
        id: input.id,
        name: input.name,
        manufacturer: input.manufacturer,
        state: input.state,
        connection: input.connection
      })),
      outputs: this.outputs.map((output) => ({
        id: output.id,
        name: output.name,
        manufacturer: output.manufacturer,
        state: output.state,
        connection: output.connection
      }))
    });
  }

  handleMidiMessage(message, input) {
    const data = Array.from(message.data);
    const status = data[0];
    const command = status & 0xf0;
    const channel = (status & 0x0f) + 1;

    const note = data[1];
    const velocity = data[2];

    if (command === 0x90 && velocity > 0) {
      this.activeNotes.add(note);

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

    if (status === 0xf8) {
      this.emit("midi:clock", {
        input: input.name
      });

      return;
    }

    if (status === 0xfa) {
      this.emit("midi:start", {
        input: input.name
      });

      return;
    }

    if (status === 0xfc) {
      this.emit("midi:stop", {
        input: input.name
      });

      return;
    }

    this.emit("midi:message", {
      input: input.name,
      channel,
      data
    });
  }
}

export const midiEngine = new MidiEngine();
