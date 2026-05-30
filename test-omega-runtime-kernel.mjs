import { createOmegaKernel } from "./backend/src/runtime/runtimeOmegaKernel.js";

const runtime = createOmegaKernel();

console.log(JSON.stringify(runtime, null, 2));

if (!runtime.ok) throw new Error("Omega kernel failed");
if (!runtime.infinite.ok) throw new Error("Infinite kernel failed");
if (!runtime.hypervisor.ok) throw new Error("Hypervisor failed");
if (!runtime.logic.ok) throw new Error("Logic failed");
if (!runtime.fabric.ok) throw new Error("Fabric failed");
if (!runtime.engine.ok) throw new Error("Engine failed");

console.log("Omega runtime kernel test passed");
