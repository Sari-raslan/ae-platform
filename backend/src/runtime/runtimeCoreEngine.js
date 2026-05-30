export function createCoreEngine() {
  const cycles = [];

  function cycle(event = {}) {
    const entry = {
      id: `cycle-${cycles.length + 1}`,
      state: event.state || "runtime-cycle",
      createdAt: new Date().toISOString(),
    };

    cycles.push(entry);

    return entry;
  }

  function snapshot() {
    return {
      ok: true,
      cycles,
      cycleCount: cycles.length,
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    cycle,
    snapshot,
  };
}
