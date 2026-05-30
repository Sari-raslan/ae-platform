export function createClusterManager() {
  const nodes = [];

  function register(node = {}) {
    const entry = {
      id: node.id || `node-${nodes.length + 1}`,
      role: node.role || "runtime-node",
      status: "online",
      createdAt: new Date().toISOString(),
    };

    nodes.push(entry);

    return entry;
  }

  function snapshot() {
    return {
      ok: true,
      nodes,
      nodeCount: nodes.length,
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    register,
    snapshot,
  };
}
