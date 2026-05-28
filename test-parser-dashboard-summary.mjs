import { buildParserDashboardSummary } from "./backend/parsers/korg/parserDashboardSummary.js";

const summary = buildParserDashboardSummary({
  styleBankCatalog: {
    styleCount: 15,
    bankCount: 3,
    assignedCount: 12,
    unassignedCount: 3,
  },
  styleSlotDiagnostics: {
    conflicts: [
      { bank: "A", slot: 1 },
    ],
  },
  songBookStyleLinks: {
    linkCount: 7,
    unresolvedCount: 1,
  },
  pcmDependencyDiagnostics: {
    totalLinks: 20,
    unresolvedCount: 2,
    affectedStyles: 1,
  },
  repairSuggestions: {
    suggestionCount: 4,
  },
  setIntegritySummary: {
    level: "warning",
    healthScore: 78,
  },
});

console.log(JSON.stringify(summary, null, 2));

if (summary.status !== "warning") {
  throw new Error("Expected warning status");
}

if (summary.styles.conflicts !== 1) {
  throw new Error("Expected 1 style conflict");
}

if (summary.pcm.unresolved !== 2) {
  throw new Error("Expected 2 unresolved PCM refs");
}

console.log("Parser dashboard summary test passed");
