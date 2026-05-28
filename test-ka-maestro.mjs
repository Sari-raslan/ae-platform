import { runKaMaestro } from "./backend/agents/kaMaestro.js";

const result = runKaMaestro({
  analysis: {
    parserDashboardSummary: {
      status: "ready",
      healthScore: 95,
    },
  },
  agenda: {
    active: "Korg Integrity API",
    next: "Frontend Integrity Dashboard",
  },
});

console.log(JSON.stringify(result, null, 2));

if (result.agentCount !== 7) {
  throw new Error("Expected 7 KA agents");
}

if (result.taskCount !== 7) {
  throw new Error("Expected 7 orchestrated tasks");
}

if (result.orchestrator !== "KA Maestro") {
  throw new Error("Expected KA Maestro orchestrator");
}

console.log("KA Maestro orchestrator test passed");
