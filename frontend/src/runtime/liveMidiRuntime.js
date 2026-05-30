export function createLiveMidiRuntime({
  onNoteOn,
  onNoteOff,
  onControlChange,
} = {}) {
  let midiAccess = null;

  async function connect() {
    if (!navigator.requestMIDIAccess) {
      throw new Error("Web MIDI unsupported");
    }

    midiAccess = await navigator.requestMIDIAccess({
      sysex: false,
    });

    for (const input of midiAccess.inputs.values()) {
      input.onmidimessage = handleMessage;
    }

    return snapshot();
  }

  function handleMessage(message) {
    const [status, data1, data2] = message.data;

    const command = status & 0xf0;
    const channel = (status & 0x0f) + 1;

    const payload = {
      command,
      channel,
      data1,
      data2,
      timestamp: Date.now(),
    };

    if (command === 0x90 && data2 > 0) {
      onNoteOn?.({
        note: data1,
        velocity: data2,
        ...payload,
      });
    } else if (command === 0x80 || (command === 0x90 && data2 === 0)) {
      onNoteOff?.({
        note: data1,
        velocity: data2,
        ...payload,
      });
    } else if (command === 0xb0) {
      onControlChange?.({
        controller: data1,
        value: data2,
        ...payload,
      });
    }
  }

  function snapshot() {
    return {
      ok: true,
      connectedInputs: midiAccess
        ? Array.from(midiAccess.inputs.values()).map((d) => ({
            id: d.id,
            name: d.name,
          }))
        : [],
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    connect,
    snapshot,
  };
}
