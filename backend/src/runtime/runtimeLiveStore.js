import { buildRuntimeApiResponse } from "./runtimeApiResponse.js";
import { createRealtimeArrangerEngine } from "./runtimeRealtimeEngine.js";

let lastAnalysis = null;
let lastRuntimeResponse = null;
let engine = null;

export function updateRuntimeAnalysis(analysis = {}) {
  lastAnalysis = {
    ...analysis,
    updatedAt: new Date().toISOString(),
  };

  lastRuntimeResponse = buildRuntimeApiResponse(lastAnalysis);

  engine = createRealtimeArrangerEngine({
    runtime: lastRuntimeResponse.runtime,
  });

  return getRuntimeSnapshot();
}

export function getRuntimeSnapshot() {
  if (!lastRuntimeResponse) {
    updateRuntimeAnalysis({
      setName: "Runtime SET",
      styleBankCatalog: {},
      pcmDependencyDiagnostics: {},
      songBookStyleLinks: {},
    });
  }

  return {
    ok: true,
    analysis: lastAnalysis,
    runtimeResponse: lastRuntimeResponse,
    engineStatus: engine?.getStatus?.() || null,
    generatedAt: new Date().toISOString(),
  };
}

export function executeRuntimeCommand(command = {}) {
  if (!engine) getRuntimeSnapshot();

  if (command.type === "start") return engine.start();
  if (command.type === "stop") return engine.stop();
  if (command.type === "status") return engine.getStatus();

  throw new Error(\`Unsupported runtime command: \${command.type}\`);
}
