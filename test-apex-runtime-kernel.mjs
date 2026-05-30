import { createApexKernel } from "./backend/src/runtime/runtimeApexKernel.js";

const runtime = createApexKernel();

console.log(JSON.stringify(runtime, null, 2));

if (!runtime.ok) throw new Error("Apex kernel failed");
if (!runtime.omega.ok) throw new Error("Omega failed");
if (!runtime.meta.ok) throw new Error("Meta failed");
if (!runtime.matrix.ok) throw new Error("Matrix failed");
if (!runtime.control.ok) throw new Error("Control failed");
if (!runtime.simulation.ok) throw new Error("Simulation failed");
if (!runtime.quantum.ok) throw new Error("Quantum failed");

console.log("Apex runtime kernel test passed");
