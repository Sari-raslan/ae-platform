export function createStyleScheduler() {
  const queue = [];

  function schedule(event = {}) {
    const item = {
      id: `schedule-${queue.length + 1}`,
      type: event.type || "variation",
      target: event.target || null,
      bar: event.bar || 1,
      beat: event.beat || 1,
      createdAt: new Date().toISOString(),
    };

    queue.push(item);

    return item;
  }

  function snapshot() {
    return {
      ok: true,
      queue,
      queueLength: queue.length,
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    schedule,
    snapshot,
  };
}
