export async function createRealtimeMidiFoundation({ onEvent } = {}) {
  const state = {
    supported: typeof navigator !== "undefined" && Boolean(navigator.requestMIDIAccess),
    enabled: false,
    inputs: [],
    outputs: [],
    events: [],
    error: null,
  };

  function pushEvent(event) {
    state.events.unshift({
      ...event,
      receivedAt: new Date().toISOString(),
    });

    state.events = state.events.slice(0, 100);

    if (typeof onEvent === "function") {
      onEvent(event);
    }
  }

  function decodeMessage(message) {
    const [status, data1, data2] = message.data;
    const command = status & 0xf0;
    const channel = (status & 0x0f) + 1;

    if (command === 0x90 && data2 > 0) {
      return {
        type: "note-on",
        channel,
        note: data1,
        velocity: data2,
      };
    }

    if (command === 0x80 || (command === 0x90 && data2 === 0)) {
      return {
        type: "note-off",
        channel,
        note: data1,
        velocity: data2 || 0,
      };
    }

    if (command === 0xb0) {
      return {
        type: "control-change",
        channel,
        controller: data1,
        value: data2,
      };
    }

    if (command === 0xe0) {
      return {
        type: "pitch-bend",
        channel,
        value: (data2 << 7) + data1 - 8192,
      };
    }

    return {
      type: "raw",
      channel,
      status,
      data1,
      data2,
    };
  }

  async function connect() {
    try {
      if (!state.supported) {
        state.error = "Web MIDI is not supported in this browser.";
        return snapshot();
      }

      const access = await navigator.requestMIDIAccess();

      state.enabled = true;
      state.inputs = [...access.inputs.values()].map((input) => input.name || input.id);
      state.outputs = [...access.outputs.values()].map((output) => output.name || output.id);

      for (const input of access.inputs.values()) {
        input.onmidimessage = (message) => {
          pushEvent(decodeMessage(message));
        };
      }

      return snapshot();
    } catch (error) {
      state.error = error.message;
      return snapshot();
    }
  }

  function snapshot() {
    return {
      ...state,
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    connect,
    snapshot,
    decodeMessage,
  };
}
