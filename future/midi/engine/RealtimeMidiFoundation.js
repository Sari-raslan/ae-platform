export async function createRealtimeMidiFoundation() {

  const state = {
    enabled: false,
    inputs: [],
    outputs: [],
    devices: [],
  };

  if (navigator.requestMIDIAccess) {

    const midi =
      await navigator.requestMIDIAccess();

    state.enabled = true;

    for (const input of midi.inputs.values()) {

      state.inputs.push(input.name);

      state.devices.push({
        type: "input",
        name: input.name,
      });
    }

    for (const output of midi.outputs.values()) {

      state.outputs.push(output.name);

      state.devices.push({
        type: "output",
        name: output.name,
      });
    }
  }

  return {
    snapshot() {
      return {
        ...state,
        generatedAt:
          new Date().toISOString(),
      };
    }
  };
}
