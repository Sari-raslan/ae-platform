import { buildCodexExecutionKernel } from "./backend/agents/codexExecutionKernel.js";

const kernel = buildCodexExecutionKernel({
  project: "Keyboard Manager",
  branch: "main",
});

console.log(JSON.stringify(kernel, null, 2));

if (kernel.agentCount !== 7) throw new Error("Expected 7 agents");
if (!kernel.unifiedExecutionMission) throw new Error("Missing unified mission");
if (kernel.unifiedExecutionMission.executionOrder.length !== 7) {
  throw new Error("Expected full agent execution order");
}

console.log("Codex execution kernel test passed");
