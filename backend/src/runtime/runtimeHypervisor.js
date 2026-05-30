export function createRuntimeHypervisor() {
  const instances = [];

  function launch(instance = {}) {
    const entry = {
      id: instance.id || `instance-${instances.length + 1}`,
      role: instance.role || "runtime-instance",
      state: "running",
      launchedAt: new Date().toISOString(),
    };

    instances.push(entry);

    return entry;
  }

  function snapshot() {
    return {
      ok: true,
      instances,
      instanceCount: instances.length,
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    launch,
    snapshot,
  };
}
