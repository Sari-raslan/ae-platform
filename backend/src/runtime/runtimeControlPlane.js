export function createControlPlane() {
  const controls = [];

  function issue(command = {}) {
    const entry = {
      id: `control-${controls.length + 1}`,
      command: command.type || "runtime-command",
      issuedAt: new Date().toISOString(),
    };

    controls.push(entry);

    return entry;
  }

  function snapshot() {
    return {
      ok: true,
      controls,
      controlCount: controls.length,
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    issue,
    snapshot,
  };
}
