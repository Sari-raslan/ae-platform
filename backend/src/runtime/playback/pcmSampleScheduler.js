export function createPcmSampleScheduler() {
  const scheduled = [];

  function trigger(sample = {}) {
    const event = {
      id: sample.id || `pcm-${scheduled.length + 1}`,
      sample: sample.sample || "kick.wav",
      velocity: sample.velocity || 100,
      channel: sample.channel || 10,
      frame: sample.frame || 0,
      createdAt: new Date().toISOString(),
    };

    scheduled.push(event);

    return event;
  }

  function consume() {
    return scheduled.splice(0, scheduled.length);
  }

  function snapshot() {
    return {
      ok: true,
      scheduled,
      scheduledCount: scheduled.length,
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    trigger,
    consume,
    snapshot,
  };
}
