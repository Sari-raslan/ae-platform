export function createSimulationGrid() {
  const simulations = [];

  function simulate(task = {}) {
    const entry = {
      id: `simulation-${simulations.length + 1}`,
      task: task.name || "runtime-simulation",
      simulatedAt: new Date().toISOString(),
    };

    simulations.push(entry);

    return entry;
  }

  function snapshot() {
    return {
      ok: true,
      simulations,
      simulationCount: simulations.length,
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    simulate,
    snapshot,
  };
}
