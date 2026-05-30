export function createRuntimeWorkerPool({
  name = "runtime-worker-pool",
  size = 2,
} = {}) {
  const workers = Array.from({ length: size }).map((_, index) => ({
    id: `worker-${index + 1}`,
    status: "idle",
    activeTask: null,
    completedTasks: 0,
  }));

  const queue = [];
  const history = [];

  function nextWorker() {
    return workers.find((worker) => worker.status === "idle") || null;
  }

  async function execute(task = {}) {
    const worker = nextWorker();

    if (!worker) {
      queue.push(task);
      return {
        ok: true,
        queued: true,
        queueLength: queue.length,
      };
    }

    worker.status = "busy";
    worker.activeTask = task.name || "runtime-task";

    const result = {
      ok: true,
      workerId: worker.id,
      task,
      startedAt: new Date().toISOString(),
    };

    await Promise.resolve();

    worker.status = "idle";
    worker.completedTasks += 1;
    worker.activeTask = null;

    result.completedAt = new Date().toISOString();

    history.push(result);

    if (queue.length > 0) {
      const next = queue.shift();
      execute(next);
    }

    return result;
  }

  function snapshot() {
    return {
      ok: true,
      name,
      size,
      queueLength: queue.length,
      workers,
      historyCount: history.length,
      history,
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    execute,
    snapshot,
  };
}
