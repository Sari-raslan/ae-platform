export function createQuantumBridge() {
  const links = [];

  function link(target = {}) {
    const entry = {
      id: `quantum-${links.length + 1}`,
      target: target.name || "runtime-link",
      linkedAt: new Date().toISOString(),
    };

    links.push(entry);

    return entry;
  }

  function snapshot() {
    return {
      ok: true,
      links,
      linkCount: links.length,
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    link,
    snapshot,
  };
}
