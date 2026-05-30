import { createRuntimeWorkerPool } from "./backend/src/runtime/runtimeWorkerPool.js";
import { createRuntimeMemoryProfiler } from "./backend/src/runtime/runtimeMemoryProfiler.js";
import { createRuntimeAutoRepairEngine } from "./backend/src/runtime/runtimeAutoRepair.js";
import { buildRuntimeServerView } from "./backend/src/runtime/runtimeApiServerView.js";

const pool = createRuntimeWorkerPool({
  size: 2,
});

await pool.execute({
  name: "parse-style-bank",
});

const memory = createRuntimeMemoryProfiler();
memory.sample("initial-runtime");

const repair = createRuntimeAutoRepairEngine({
  diagnostics: [
    {
      type: "missing-pcm",
      level: "warning",
    },
  ],
});

const repairResult = repair.execute();

const view = buildRuntimeServerView({
  runtime: {
    health: {
      status: "experimental-ready",
    },
    transport: {
      state: "stopped",
      tempo: 120,
    },
    preload: {
      styleQueueCount: 1,
      pcmCacheCount: 1,
    },
  },
  realtime: {
    active: true,
  },
  memory: memory.summary(),
  workers: pool.snapshot(),
  repairs: repairResult,
});

console.log(JSON.stringify(view, null, 2));

if (!view.ok) throw new Error("Runtime server view failed");
if (!view.memory.ok) throw new Error("Memory profiler failed");
if (!view.workers.ok) throw new Error("Worker pool failed");
if (view.repairs.repairCount !== 1) throw new Error("Repair engine failed");

console.log("Runtime infrastructure test passed");
