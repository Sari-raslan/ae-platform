import { createInfiniteKernel } from "./runtimeInfiniteKernel.js";
import { createRuntimeHypervisor } from "./runtimeHypervisor.js";
import { createLogicCore } from "./runtimeLogicCore.js";
import { createSystemFabric } from "./runtimeSystemFabric.js";
import { createCoreEngine } from "./runtimeCoreEngine.js";

export function createOmegaKernel() {
  const infinite = createInfiniteKernel();

  const hypervisor = createRuntimeHypervisor();
  const logic = createLogicCore();
  const fabric = createSystemFabric();
  const engine = createCoreEngine();

  hypervisor.launch({
    role: "master-runtime",
  });

  logic.execute({
    type: "runtime-analysis",
  });

  fabric.attach({
    type: "runtime-bus",
  });

  engine.cycle({
    state: "runtime-active",
  });

  return {
    ok: true,
    infinite,
    hypervisor: hypervisor.snapshot(),
    logic: logic.snapshot(),
    fabric: fabric.snapshot(),
    engine: engine.snapshot(),
    generatedAt: new Date().toISOString(),
  };
}
