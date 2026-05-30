export function createWebMidiBridge() {
  const devices = [];
  const events = [];

  function registerDevice(device = {}) {
    const entry = {
      id: device.id || `device-${devices.length + 1}`,
      name: device.name || "Unknown MIDI Device",
      type: device.type || "input",
      connectedAt: new Date().toISOString(),
    };

    devices.push(entry);
    return entry;
  }

  function receive(message = {}) {
    const event = {
      id: `event-${events.length + 1}`,
      ...message,
      receivedAt: new Date().toISOString(),
    };

    events.push(event);

    return event;
  }

  function snapshot() {
    return {
      ok: true,
      devices,
      events,
      deviceCount: devices.length,
      eventCount: events.length,
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    registerDevice,
    receive,
    snapshot,
  };
}
