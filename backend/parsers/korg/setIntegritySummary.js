export function summarizeSetIntegrity({
  styleBankCatalog = {},
  styleSlotDiagnostics = {},
  songBookStyleLinks = {},
  pcmDependencyDiagnostics = {},
  repairSuggestions = {},
} = {}) {
  const styleCount = styleBankCatalog.styleCount || 0;
  const bankCount = styleBankCatalog.bankCount || 0;
  const slotConflictCount = (styleSlotDiagnostics.conflicts || []).length;
  const unresolvedSongBookCount = songBookStyleLinks.unresolvedCount || 0;
  const unresolvedPcmCount = pcmDependencyDiagnostics.unresolvedCount || 0;
  const suggestionCount = repairSuggestions.suggestionCount || 0;

  const healthScore = Math.max(
    0,
    100 -
      slotConflictCount * 15 -
      unresolvedSongBookCount * 10 -
      unresolvedPcmCount * 8
  );

  let level = "good";
  if (healthScore < 60) level = "critical";
  else if (healthScore < 85) level = "warning";

  return {
    level,
    healthScore,
    styleCount,
    bankCount,
    slotConflictCount,
    unresolvedSongBookCount,
    unresolvedPcmCount,
    suggestionCount,
    diagnostics: [
      {
        type: "set-integrity-summary",
        level: level === "good" ? "info" : "warn",
        message: `SET integrity ${level}: ${healthScore}/100`,
        data: {
          healthScore,
          slotConflictCount,
          unresolvedSongBookCount,
          unresolvedPcmCount,
          suggestionCount,
        },
      },
    ],
  };
}
