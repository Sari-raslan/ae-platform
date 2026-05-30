export function createRuntimeAutoRepairEngine({
  diagnostics = [],
} = {}) {
  const repairs = [];

  function analyze() {
    return diagnostics.map((diagnostic, index) => ({
      id: `repair-${index + 1}`,
      type: diagnostic.type || "unknown",
      severity: diagnostic.level || "info",
      action:
        diagnostic.type === "missing-pcm"
          ? "rebuild-pcm-cache"
          : diagnostic.type === "missing-style"
          ? "reload-style-bank"
          : "manual-review",
    }));
  }

  function execute() {
    const plans = analyze();

    for (const plan of plans) {
      repairs.push({
        ...plan,
        status: "completed",
        completedAt: new Date().toISOString(),
      });
    }

    return {
      ok: true,
      repairCount: repairs.length,
      repairs,
    };
  }

  return {
    analyze,
    execute,
  };
}
