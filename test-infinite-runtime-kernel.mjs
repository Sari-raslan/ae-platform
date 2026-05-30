import { createInfiniteKernel } from "./backend/src/runtime/runtimeInfiniteKernel.js";

const runtime = createInfiniteKernel();

console.log(JSON.stringify(runtime, null, 2));

if (!runtime.ok) throw new Error("Infinite kernel failed");
if (!runtime.universe.ok) throw new Error("Universe failed");
if (!runtime.cluster.ok) throw new Error("Cluster failed");
if (!runtime.render.ok) throw new Error("Render failed");
if (!runtime.transport.ok) throw new Error("Transport failed");
if (!runtime.monitor.ok) throw new Error("Monitor failed");
if (!runtime.storage.ok) throw new Error("Storage failed");

console.log("Infinite runtime kernel test passed");
