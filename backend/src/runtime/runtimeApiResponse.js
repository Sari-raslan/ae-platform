import { bindAnalysisToLiveRuntime } from "./runtimeBinding.js";

export function buildRuntimeApiResponse(analysis = {}) {
  const runtime = bindAnalysisToLiveRuntime(analysis);

  return {
    ok: true,
    endpoint: "/api/runtime/live",
    status: runtime.health?.status || "ready",
    runtime,
    generatedAt: new Date().toISOString(),
  };
}
