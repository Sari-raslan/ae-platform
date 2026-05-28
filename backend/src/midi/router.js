const midi = require("midi");

class MidiRouter {
  constructor() {
    this.input = null;
    this.output = null;
  }

  connect(inputPort = 0, outputPort = 0) {
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

module.exports = new MidiRouter();
