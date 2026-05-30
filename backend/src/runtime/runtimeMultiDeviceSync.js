export function createMultiDeviceSync() {
  const devices = [];

  function register(device) {
    devices.push({
      ...device,
      connectedAt: new Date().toISOString(),
    });

    return snapshot();
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
