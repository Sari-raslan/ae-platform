import { buildRepairPlanner } from "./backend/parsers/korg/repairPlanner.js";
import { buildStylePreloadPlan } from "./backend/parsers/korg/stylePreloadPlan.js";
import { buildPcmPreloadMap } from "./backend/parsers/korg/pcmPreloadMap.js";
import { buildArrangerRuntimePlan } from "./backend/parsers/korg/arrangerRuntimePlan.js";

const repairPlan = buildRepairPlanner({
  repairSuggestions: {
    suggestions: [
      {
        type: "missing-pcm",
        severity: "medium",
        message: "Restore missing PCM",
        data: { styleName: "STYLE_A.STY" },
      },
    ],
  },
});

const stylePreloadPlan = buildStylePreloadPlan({
  styleBankCatalog: {
    banks: {
      A: {
        slots: {
          "1": {
            primaryEntry: {
              fileName: "STYLE_A.STY",
              relativePath: "STYLE/BANK_A/STYLE_A.STY",
              bank: "A",
              slot: 1,
            },
          },
        },
      },
    },
  },
  songBookStyleLinks: {
    links: [
      {
        style: {
          fileName: "STYLE_A.STY",
          relativePath: "STYLE/BANK_A/STYLE_A.STY",
          bank: "A",
          slot: 1,
        },
      },
    ],
  },
});

const pcmPreloadMap = buildPcmPreloadMap({
  pcmDependencyDiagnostics: {
    links: [
      {
        style: { fileName: "STYLE_A.STY" },
        pcm: {
          fileName: "KICK_01.PCM",
          relativePath: "PCM/KICK_01.PCM",
        },
        reference: "KICK_01.PCM",
      },
    ],
  },
});

const runtimePlan = buildArrangerRuntimePlan({
  parserDashboardSummary: {
    status: "ready",
    healthScore: 95,
  },
  stylePreloadPlan,
  pcmPreloadMap,
  repairPlan,
});

console.log(JSON.stringify({
  repairPlan,
  stylePreloadPlan,
  pcmPreloadMap,
  runtimePlan,
}, null, 2));

if (repairPlan.planCount !== 1) throw new Error("Repair planner failed");
if (stylePreloadPlan.preloadCount < 1) throw new Error("Style preload failed");
if (pcmPreloadMap.styleCount !== 1) throw new Error("PCM preload map failed");
if (!runtimePlan.transport.ready) throw new Error("Runtime plan failed");

console.log("Backend continuation batch passed");
