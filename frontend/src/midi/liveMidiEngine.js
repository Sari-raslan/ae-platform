export async function createLiveMidiEngine() {
  const state = {
    supported: false,
    inputs: [],
    outputs: [],
  };

  if (navigator.requestMIDIAccess) {
    const midi = await navigator.requestMIDIAccess();

    state.supported = true;

    state.inputs =
      [...midi.inputs.values()].map((i) => i.name);

    state.outputs =
      [...midi.outputs.values()].map((o) => o.name);
  }

  return state;
}
