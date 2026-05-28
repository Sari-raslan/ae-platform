import { buildCodexMasterMission } from "./backend/agents/codexMasterMission.js";

const mission = buildCodexMasterMission({
  project: "Keyboard Manager",
  repository: "Sari-raslan/Universal-Arranger-OS-Design",
  phase: "Phase 3 to Phase 4 Bridge",
});

console.log(JSON.stringify(mission, null, 2));

if (mission.agentCount !== 7) throw new Error("Expected 7 agents");
if (!mission.unifiedTask) throw new Error("Expected unified task");
if (mission.unifiedTask.executionOrder.length !== 7) {
  throw new Error("Expected all agents in execution order");
}

console.log("Codex master mission test passed");
