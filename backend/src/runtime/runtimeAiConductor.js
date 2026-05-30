export function createAiConductor() {
  const decisions = [];

  function analyze(context = {}) {
    const result = {
      id: `decision-${decisions.length + 1}`,
      tempoSuggestion: 120,
      variationSuggestion: "VAR1",
      fillSuggestion: "FILL1",
      generatedAt: new Date().toISOString(),
    };

    decisions.push(result);

    return result;
  }

  function snapshot() {
    return {
      ok: true,
      decisions,
      decisionCount: decisions.length,
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    analyze,
    snapshot,
  };
}
