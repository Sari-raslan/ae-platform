export function createTelemetrySystem() {
  const metrics = [];

  function track(metric = {}) {
    const entry = {
      id: `metric-${metrics.length + 1}`,
      ...metric,
      trackedAt: new Date().toISOString(),
    };

    metrics.push(entry);

    return entry;
  }

  function snapshot() {
    return {
      ok: true,
      metrics,
      metricCount: metrics.length,
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    track,
    snapshot,
  };
}
