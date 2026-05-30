export function createRealtimeMidiPlaybackEngine() {
  const events = [];

  function send(event = {}) {
    const item = {
      id: event.id || `midi-${events.length + 1}`,
      type: event.type || "note-on",
      note: event.note || 60,
      velocity: event.velocity || 100,
      channel: event.channel || 1,
      createdAt: new Date().toISOString(),
    };

    events.push(item);

    return item;
  }

  function consume() {
    return events.splice(0, events.length);
  }

  function snapshot() {
    return {
      ok: true,
      events,
      eventCount: events.length,
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    send,
    consume,
    snapshot,
  };
}
