export function buildParserDashboardSummary({
  styleBankCatalog = {},
  styleSlotDiagnostics = {},
  songBookStyleLinks = {},
  pcmDependencyDiagnostics = {},
  repairSuggestions = {},
  setIntegritySummary = {},
} = {}) {
  return {
    status: setIntegritySummary.level || "unknown",
    healthScore: setIntegritySummary.healthScore ?? null,

    styles: {
      total: styleBankCatalog.styleCount || 0,
      banks: styleBankCatalog.bankCount || 0,
      assigned: styleBankCatalog.assignedCount || 0,
      unassigned: styleBankCatalog.unassignedCount || 0,
      conflicts: (styleSlotDiagnostics.conflicts || []).length,
    },

    songBook: {
      linked: songBookStyleLinks.linkCount || 0,
      unresolved: songBookStyleLinks.unresolvedCount || 0,
    },

    pcm: {
      linked: pcmDependencyDiagnostics.totalLinks || 0,
      unresolved: pcmDependencyDiagnostics.unresolvedCount || 0,
      affectedStyles: pcmDependencyDiagnostics.affectedStyles || 0,
    },

    repair: {
      suggestions: repairSuggestions.suggestionCount || 0,
    },

    generatedAt: new Date().toISOString(),
  };
}
