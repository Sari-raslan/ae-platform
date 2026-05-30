export function createHardwareBridge() {
  const devices = [];

  function connect(device = {}) {
    const entry = {
      id: device.id || `hardware-${devices.length + 1}`,
      model: device.model || "Unknown",
      vendor: device.vendor || "KORG",
      connectedAt: new Date().toISOString(),
    };

    devices.push(entry);

    return entry;
  }

  function snapshot() {
    return {
      ok: true,
      devices,
      connected: devices.length > 0,
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    connect,
    snapshot,
  };
}
