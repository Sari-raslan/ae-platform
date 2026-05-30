export function buildRuntimeServerView({
  runtime = {},
  realtime = {},
  memory = {},
  workers = {},
  repairs = {},
} = {}) {
  return {
    ok: true,
    server: {
      runtimeStatus: runtime.health?.status || "unknown",
      transport: runtime.transport || null,
      preload: runtime.preload || null,
    },
    realtime,
    memory,
    workers,
    repairs,
    generatedAt: new Date().toISOString(),
  };
}
