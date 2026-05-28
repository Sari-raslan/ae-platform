import { runCodexUnifiedProgram } from "./backend/agents/codexUnifiedProgram.js";

const result = runCodexUnifiedProgram({
  parserDashboardSummary: {
    status: "ready",
    healthScore: 95,
  },
  project: "Keyboard Manager",
  phase: "Phase 3 to Phase 4 Bridge",
});

console.log(JSON.stringify(result, null, 2));

if (result.agentCount !== 7) {
  throw new Error("Expected 7 agents");
}

if (!result.unifiedMission) {
  throw new Error("Expected unified mission");
}

if (result.unifiedMission.requiredVerification.length !== 3) {
  throw new Error("Expected verification commands");
}

console.log("Codex unified program test passed");
