export function createRegistrationMemorySystem() {
  let banks = [];

  function save(registration = {}) {
    const item = {
      id: registration.id || `registration-${banks.length + 1}`,
      name: registration.name || "New Registration",
      style: registration.style || "POP",
      tempo: registration.tempo || 120,
      chord: registration.chord || "C major",
      variation: registration.variation || "VAR1",
      savedAt: new Date().toISOString(),
    };

    banks.push(item);

    return item;
  }

  function recall(id) {
    return banks.find((item) => item.id === id) || null;
  }

  function snapshot() {
    return {
      ok: true,
      banks,
      count: banks.length,
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    save,
    recall,
    snapshot,
  };
}
