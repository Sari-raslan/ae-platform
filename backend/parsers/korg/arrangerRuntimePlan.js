export function buildArrangerRuntimePlan({
  parserDashboardSummary = {},
  stylePreloadPlan = {},
  pcmPreloadMap = {},
  repairPlan = {},
} = {}) {
  return {
    status: parserDashboardSummary.status || "ready",
    healthScore: parserDashboardSummary.healthScore ?? null,
    stylePreloadCount: stylePreloadPlan.preloadCount || 0,
    pcmMappedStyleCount: pcmPreloadMap.styleCount || 0,
    repairPlanCount: repairPlan.planCount || 0,
    transport: {
      state: "stopped",
      clock: "internal",
      ready: true,
    },
    routing: {
      midiInput: "default",
      midiOutput: "default",
      audioOutput: "default",
    },
    generatedAt: new Date().toISOString(),
  };
}
