export class MidiEngine {
  async initialize() {
    if (!navigator.requestMIDIAccess) {
      console.warn("Web MIDI unavailable");
      return { ok: false };
    }
    const access = await navigator.requestMIDIAccess({ sysex: false });
    const inputs = Array.from(access.inputs.values());
    const outputs = Array.from(access.outputs.values());
    return { ok: true, inputs: inputs.map((i) => i.name), outputs: outputs.map((o) => o.name) };
  }
}
