async function loadMidi() {
  try {
    return await import("midi");
  } catch (error) {
    return null;
  }
}

class MidiRouter {
  constructor() {
    this.input = null;
    this.output = null;
  }

  async connect(inputPort = 0, outputPort = 0) {
    const midi = await loadMidi();
    if (!midi) {
      return {
        ok: false,
        nativeAvailable: false,
        inputPort,
        outputPort,
        error: "Native backend MIDI module is not installed."
      };
    }

    this.input = new midi.Input();
    this.output = new midi.Output();

    this.input.openPort(inputPort);
    this.output.openPort(outputPort);

    this.input.on("message", (deltaTime, message) => {
      try {
        this.output.sendMessage(message);
      } catch {}
    });

    return {
      ok: true,
      inputPort,
      outputPort
    };
  }
}

export default new MidiRouter();
