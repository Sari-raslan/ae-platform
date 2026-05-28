import { summarizeSetIntegrity } from "./backend/parsers/korg/setIntegritySummary.js";

const result = summarizeSetIntegrity({
  styleBankCatalog: {
    styleCount: 15,
    bankCount: 3,
  },
  styleSlotDiagnostics: {
    conflicts: [
      { bank: "A", slot: 1 },
    ],
  },
  songBookStyleLinks: {
    unresolvedCount: 1,
  },
  pcmDependencyDiagnostics: {
    unresolvedCount: 2,
  },
  repairSuggestions: {
    suggestionCount: 4,
  },
});

console.log(JSON.stringify(result, null, 2));

if (result.healthScore !== 59) {
  throw new Error("Expected health score 59");
}

if (result.level !== "critical") {
  throw new Error("Expected critical integrity level");
}

console.log("SET integrity summary test passed");
