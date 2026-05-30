import { createRuntimeMasterSystem } from "./runtimeMasterSystem.js";
import { createWebMidiBridge } from "./runtimeWebMidiBridge.js";
import { createStyleScheduler } from "./runtimeStyleScheduler.js";
import { createHardwareBridge } from "./runtimeHardwareBridge.js";
import {
  saveRuntimeSession,
  loadRuntimeSession,
} from "./runtimePersistentSession.js";

export function createRuntimeExecutionPlatform() {
  const master = createRuntimeMasterSystem();
  const midi = createWebMidiBridge();
  const scheduler = createStyleScheduler();
  const hardware = createHardwareBridge();

  saveRuntimeSession({
    setName: "Runtime SET",
    transport: {
      state: "stopped",
      tempo: 120,
    },
  });

  return {
    ok: true,
    master,
    midi: midi.snapshot(),
    scheduler: scheduler.snapshot(),
    hardware: hardware.snapshot(),
    session: loadRuntimeSession(),
    generatedAt: new Date().toISOString(),
  };
}
