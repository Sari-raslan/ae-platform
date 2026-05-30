import { buildRuntimeDashboardView } from "./backend/src/runtime/runtimeDashboardView.js";

const view = buildRuntimeDashboardView({
  runtimeSnapshot: {
    runtimeResponse: {
      runtime: {
        setName: "sar.SET",
        transport: {
          state: "stopped",
          tempo: 120,
        },
        preload: {
          styleQueueCount: 2,
          pcmCacheCount: 1,
        },
        health: {
          status: "experimental-ready",
        },
      },
    },
    engineStatus: {
      performance: {
        ok: true,
      },
    },
  },
});

console.log(JSON.stringify(view, null, 2));

if (!view.ok) throw new Error("Dashboard view failed");
if (view.summary.styleQueue !== 2) throw new Error("Style queue mismatch");

console.log("Runtime dashboard test passed");
