import { executeUnifiedKeyboardManagerMission } from "./backend/agents/unifiedKaMission.js";

const mission = executeUnifiedKeyboardManagerMission({
  parserDashboardSummary: {
    status: "ready",
    healthScore: 95,
  },
  setIntegritySummary: {
    level: "good",
    healthScore: 95,
  },
  repairSuggestions: {
    suggestionCount: 0,
  },
  arrangerRuntimePlan: {
    transport: {
      ready: true,
      state: "stopped",
      clock: "internal",
    },
  },
});

console.log(JSON.stringify(mission, null, 2));

if (mission.agentsUsed !== 7) {
  throw new Error("Expected all 7 KA agents to be used");
}

if (mission.combinedExecutionPlan.length !== 7) {
  throw new Error("Expected 7 combined execution steps");
}

if (!mission.finalUnifiedTask) {
  throw new Error("Expected final unified task");
}

console.log("Unified KA mission test passed");
