export function createRealtimeMidiRuntime() {
  const devices = [];
  const streams = [];
  const notes = [];

  function connect(device = {}) {
    const entry = {
      id: device.id || `midi-${devices.length + 1}`,
      name: device.name || "Unknown MIDI",
      connectedAt: new Date().toISOString(),
    };

    devices.push(entry);

    return entry;
  }

  function send(message = {}) {
    const event = {
      id: `stream-${streams.length + 1}`,
      ...message,
      timestamp: new Date().toISOString(),
    };

    streams.push(event);

    if (message.note) {
      notes.push({
        note: message.note,
        velocity: message.velocity || 0,
      });
    }

    return event;
  }

  function snapshot() {
    return {
      ok: true,
      devices,
      streams,
      notes,
      deviceCount: devices.length,
      streamCount: streams.length,
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    connect,
    send,
    snapshot,
  };
}
