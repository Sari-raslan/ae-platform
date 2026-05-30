export function buildRuntimeDashboardView({
  runtimeSnapshot = {},
} = {}) {
  const runtime = runtimeSnapshot.runtimeResponse?.runtime || {};
  const engine = runtimeSnapshot.engineStatus || {};

  return {
    ok: true,
    summary: {
      setName: runtime.setName || "Unknown SET",
      transport: runtime.transport?.state || "unknown",
      tempo: runtime.transport?.tempo || 0,
      styleQueue: runtime.preload?.styleQueueCount || 0,
      pcmCache: runtime.preload?.pcmCacheCount || 0,
      health: runtime.health?.status || "unknown",
    },
    styleState: engine.styleState || null,
    performance: engine.performance || null,
    midiEvents: engine.midiEvents || [],
    generatedAt: new Date().toISOString(),
  };
}
