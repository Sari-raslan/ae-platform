export function buildIntegrityViewModel({
  parserDashboardSummary = {},
  setIntegritySummary = {},
  repairPlan = {},
  stylePreloadPlan = {},
  pcmPreloadMap = {},
  arrangerRuntimePlan = {},
} = {}) {
  const healthScore =
    parserDashboardSummary.healthScore ??
    setIntegritySummary.healthScore ??
    null;

  return {
    title: "Korg SET Integrity",
    status: parserDashboardSummary.status || setIntegritySummary.level || "unknown",
    healthScore,

    cards: [
      {
        id: "health",
        label: "Health Score",
        value: healthScore,
        severity: healthScore === null ? "unknown" : healthScore >= 85 ? "good" : healthScore >= 60 ? "warning" : "critical",
      },
      {
        id: "repairs",
        label: "Repair Plans",
        value: repairPlan.planCount || 0,
        severity: (repairPlan.planCount || 0) > 0 ? "warning" : "good",
      },
      {
        id: "style-preload",
        label: "Style Preload",
        value: stylePreloadPlan.preloadCount || 0,
        severity: "info",
      },
      {
        id: "pcm-map",
        label: "PCM Mapped Styles",
        value: pcmPreloadMap.styleCount || 0,
        severity: "info",
      },
    ],

    runtime: {
      ready: arrangerRuntimePlan.transport?.ready || false,
      transportState: arrangerRuntimePlan.transport?.state || "unknown",
      clock: arrangerRuntimePlan.transport?.clock || "unknown",
      midiInput: arrangerRuntimePlan.routing?.midiInput || "default",
      midiOutput: arrangerRuntimePlan.routing?.midiOutput || "default",
    },

    generatedAt: new Date().toISOString(),
  };
}
