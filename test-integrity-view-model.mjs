import { buildIntegrityViewModel } from "./backend/parsers/korg/integrityViewModel.js";

const view = buildIntegrityViewModel({
  parserDashboardSummary: {
    status: "warning",
    healthScore: 78,
  },
  repairPlan: {
    planCount: 2,
  },
  stylePreloadPlan: {
    preloadCount: 10,
  },
  pcmPreloadMap: {
    styleCount: 4,
  },
  arrangerRuntimePlan: {
    transport: {
      ready: true,
      state: "stopped",
      clock: "internal",
    },
    routing: {
      midiInput: "default",
      midiOutput: "default",
    },
  },
});

console.log(JSON.stringify(view, null, 2));

if (view.status !== "warning") throw new Error("Expected warning status");
if (view.cards.length !== 4) throw new Error("Expected 4 dashboard cards");
if (!view.runtime.ready) throw new Error("Expected runtime ready");

console.log("Integrity view model test passed");
