import { createGlobalRuntimeKernel } from "./runtimeGlobalKernel.js";
import { createPersistentStorage } from "./runtimePersistentStorage.js";
import { createNetworkSyncLayer } from "./runtimeNetworkSync.js";
import { createLivePerformanceEngine } from "./runtimeLivePerformance.js";
import { createDeviceManager } from "./runtimeDeviceManager.js";

export function createUniverseKernel() {
  const kernel = createGlobalRuntimeKernel();
  const storage = createPersistentStorage();
  const network = createNetworkSyncLayer();
  const performance = createLivePerformanceEngine();
  const devices = createDeviceManager();

  storage.saveSession({
    name: "Runtime Session",
  });

  network.connect({
    name: "Galaxy S24",
  });

  performance.start("STYLE_A");

  devices.register({
    model: "KORG PA",
    type: "Hardware Keyboard",
  });

  return {
    ok: true,
    kernel,
    storage: storage.snapshot(),
    network: network.snapshot(),
    performance: performance.snapshot(),
    devices: devices.snapshot(),
    generatedAt: new Date().toISOString(),
  };
}
