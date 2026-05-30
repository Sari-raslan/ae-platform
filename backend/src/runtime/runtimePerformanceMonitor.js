export function createRuntimePerformanceMonitor() {
  const samples = [];

  function record(sample = {}) {
    const entry = {
      memoryUsedMb:
        sample.memoryUsedMb ??
        Math.round((process.memoryUsage?.().heapUsed || 0) / 1024 / 1024),
      eventLoopMs: sample.eventLoopMs ?? 0,
      activeStyles: sample.activeStyles ?? 0,
      pcmCacheCount: sample.pcmCacheCount ?? 0,
      timestamp: new Date().toISOString(),
    };

    samples.push(entry);
    return entry;
  }

  function summary() {
    const latest = samples[samples.length - 1] || null;

    return {
      ok: true,
      sampleCount: samples.length,
      latest,
      warning:
        latest && latest.memoryUsedMb > 512
          ? "high-memory"
          : null,
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    record,
    summary,
  };
}
