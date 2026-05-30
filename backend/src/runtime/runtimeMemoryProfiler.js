export function createRuntimeMemoryProfiler() {
  const samples = [];

  function sample(label = "runtime") {
    const usage = process.memoryUsage();

    const snapshot = {
      label,
      rssMb: Math.round(usage.rss / 1024 / 1024),
      heapUsedMb: Math.round(usage.heapUsed / 1024 / 1024),
      heapTotalMb: Math.round(usage.heapTotal / 1024 / 1024),
      externalMb: Math.round(usage.external / 1024 / 1024),
      timestamp: new Date().toISOString(),
    };

    samples.push(snapshot);

    return snapshot;
  }

  function summary() {
    const latest = samples[samples.length - 1] || null;

    return {
      ok: true,
      sampleCount: samples.length,
      latest,
      highMemory:
        latest && latest.heapUsedMb > 512,
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    sample,
    summary,
  };
}
