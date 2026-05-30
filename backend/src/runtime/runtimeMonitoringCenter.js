export function createMonitoringCenter() {
  const alerts = [];

  function alert(event = {}) {
    const entry = {
      id: `alert-${alerts.length + 1}`,
      level: event.level || "info",
      message: event.message || "runtime-event",
      createdAt: new Date().toISOString(),
    };

    alerts.push(entry);

    return entry;
  }

  function snapshot() {
    return {
      ok: true,
      alerts,
      alertCount: alerts.length,
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    alert,
    snapshot,
  };
}
