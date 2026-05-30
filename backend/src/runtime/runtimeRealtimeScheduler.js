export function createRealtimeScheduler() {
  const timeline = [];

  function queue(event = {}) {
    const item = {
      id: `timeline-${timeline.length + 1}`,
      type: event.type || "variation",
      executeAtBar: event.bar || 1,
      executeAtBeat: event.beat || 1,
      createdAt: new Date().toISOString(),
    };

    timeline.push(item);

    return item;
  }

  function snapshot() {
    return {
      ok: true,
      timeline,
      queueCount: timeline.length,
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    queue,
    snapshot,
  };
}
