export function createLiveSequencerRecorder() {
  let recording = false;
  let events = [];

  function start() {
    recording = true;
    return snapshot();
  }

  function stop() {
    recording = false;
    return snapshot();
  }

  function capture(event = {}) {
    if (!recording) return snapshot();

    events.push({
      ...event,
      capturedAt: new Date().toISOString(),
    });

    events = events.slice(-512);

    return snapshot();
  }

  function clear() {
    events = [];
    return snapshot();
  }

  function snapshot() {
    return {
      ok: true,
      recording,
      eventCount: events.length,
      events,
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    start,
    stop,
    capture,
    clear,
    snapshot,
  };
}
