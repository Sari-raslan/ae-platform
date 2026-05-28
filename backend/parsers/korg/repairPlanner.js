export function buildRepairPlanner({ repairSuggestions = {} } = {}) {
  const suggestions = repairSuggestions.suggestions || [];

  const plans = suggestions.map((item, index) => ({
    id: `repair-${index + 1}`,
    type: item.type,
    severity: item.severity || "medium",
    status: "planned",
    action:
      item.type === "style-slot-conflict"
        ? "review-duplicate-style-slot"
        : item.type === "missing-pcm"
          ? "restore-or-relink-pcm"
          : item.type === "songbook-style-missing"
            ? "relink-songbook-style"
            : "manual-review",
    message: item.message,
    data: item.data || {},
  }));

  return {
    planCount: plans.length,
    plans,
    generatedAt: new Date().toISOString(),
  };
}
