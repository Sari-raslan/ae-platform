const midi = require("midi");

function listDevices() {
  const input = new midi.Input();
  const output = new midi.Output();

  const inputs = [];
  const outputs = [];

  for (let i = 0; i < input.getPortCount(); i++) {
    inputs.push({
      id: i,
      name: input.getPortName(i)
    });
  }

  for (let i = 0; i < output.getPortCount(); i++) {
    outputs.push({
      id: i,
      name: output.getPortName(i)
    });
  }

  return {
    ok: true,
    inputs,
    outputs
  };
}

module.exports = {
  listDevices
};
