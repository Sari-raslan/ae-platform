export function createRuntimeWorkerThreads({
  workers = 2,
} = {}) {
  const state = Array.from({ length: workers }).map((_, index) => ({
    id: `worker-${index + 1}`,
    status: "idle",
  }));

  function snapshot() {
    return {
      ok: true,
      workers: state,
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    snapshot,
  };
}
