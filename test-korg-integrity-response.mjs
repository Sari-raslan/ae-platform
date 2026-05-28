import { buildKorgIntegrityResponse } from "./backend/parsers/korg/korgIntegrityResponse.js";

const result = buildKorgIntegrityResponse({
  parserDashboardSummary: {
    status: "warning",
    healthScore: 82,
  },
  setIntegritySummary: {
    level: "warning",
    healthScore: 82,
  },
  repairSuggestions: {
    suggestionCount: 2,
  },
});

console.log(JSON.stringify(result, null, 2));

if (!result.ok) throw new Error("Expected ok response");
if (result.status !== "warning") throw new Error("Expected warning status");
if (result.data.repairSuggestions.suggestionCount !== 2) {
  throw new Error("Expected repair suggestion count");
}

console.log("Korg integrity response helper test passed");
