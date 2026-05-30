export async function requestWebMidiAccess() {
  if (!navigator.requestMIDIAccess) {
    return {
      ok: false,
      error: "Web MIDI is not supported in this browser.",
      inputs: [],
      outputs: [],
    };
  }

  const access = await navigator.requestMIDIAccess({ sysex: false });

  const inputs = Array.from(access.inputs.values()).map((device) => ({
    id: device.id,
    name: device.name,
    manufacturer: device.manufacturer,
    state: device.state,
    type: device.type,
  }));

  const outputs = Array.from(access.outputs.values()).map((device) => ({
    id: device.id,
    name: device.name,
    manufacturer: device.manufacturer,
    state: device.state,
    type: device.type,
  }));

  return {
    ok: true,
    access,
    inputs,
    outputs,
  };
}

export function decodeMidiMessage(message) {
  const [status, data1, data2] = message.data;
  const command = status & 0xf0;
  const channel = (status & 0x0f) + 1;

  return {
    status,
    command,
    channel,
    note: data1,
    velocity: data2,
    type:
      command === 0x90 && data2 > 0
        ? "note-on"
        : command === 0x80 || (command === 0x90 && data2 === 0)
          ? "note-off"
          : command === 0xb0
            ? "control-change"
            : command === 0xc0
              ? "program-change"
              : "midi-message",
    receivedAt: new Date().toISOString(),
  };
}
