async function loadMidi() {
  try {
    return await import("midi");
  } catch (error) {
    return null;
  }
}

async function listMidiDevices() {
  const midi = await loadMidi();
  if (!midi) {
    return {
      ok: true,
      nativeAvailable: false,
      inputs: [],
      outputs: [],
      message: "Native backend MIDI module is not installed; Web MIDI frontend support remains available."
    };
  }

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
    nativeAvailable: true,
    inputs,
    outputs
  };
}

export { listMidiDevices };
