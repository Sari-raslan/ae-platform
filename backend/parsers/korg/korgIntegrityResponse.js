export function buildKorgIntegrityResponse(analysis = {}) {
  return {
    ok: true,
    status: analysis?.parserDashboardSummary?.status || "ready",
    generatedAt: new Date().toISOString(),
    data: {
      parserDashboardSummary: analysis.parserDashboardSummary || null,
      setIntegritySummary: analysis.setIntegritySummary || null,
      repairSuggestions: analysis.repairSuggestions || null,
      styleSlotDiagnostics: analysis.styleSlotDiagnostics || null,
      songBookStyleLinks: analysis.songBookStyleLinks || null,
      pcmDependencyDiagnostics: analysis.pcmDependencyDiagnostics || null,
    },
  };
}
