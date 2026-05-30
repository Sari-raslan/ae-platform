export function createStyleEventScheduler() {
  const patterns = [];

  function queue(event = {}) {
    const item = {
      id: event.id || `style-event-${patterns.length + 1}`,
      track: event.track || "DRUMS",
      note: event.note || 36,
      velocity: event.velocity || 110,
      step: event.step || 0,
      length: event.length || 1,
      createdAt: new Date().toISOString(),
    };

    patterns.push(item);

    return item;
  }

  function collect(step = 0) {
    return patterns.filter((item) => item.step === step);
  }

  function snapshot() {
    return {
      ok: true,
      patterns,
      patternCount: patterns.length,
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    queue,
    collect,
    snapshot,
  };
}
