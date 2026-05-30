export function createDeviceManager() {
  const devices = [];

  function register(device = {}) {
    const entry = {
      id: device.id || `device-${devices.length + 1}`,
      model: device.model || "Unknown Device",
      type: device.type || "MIDI",
      registeredAt: new Date().toISOString(),
    };

    devices.push(entry);

    return entry;
  }

  function snapshot() {
    return {
      ok: true,
      devices,
      deviceCount: devices.length,
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    register,
    snapshot,
  };
}
