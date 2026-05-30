import { getRuntimeSnapshot } from "./runtimeLiveStore.js";
import { buildRuntimeDashboardView } from "./runtimeDashboardView.js";

export function buildFrontendRuntimeBridge() {
  const snapshot = getRuntimeSnapshot();

  return {
    ok: true,
    dashboard: buildRuntimeDashboardView({
      runtimeSnapshot: snapshot,
    }),
    generatedAt: new Date().toISOString(),
  };
}
