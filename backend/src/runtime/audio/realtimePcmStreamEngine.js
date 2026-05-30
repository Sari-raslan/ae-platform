export function createRealtimePcmStreamEngine() {
  const streams = [];
  const activeVoices = [];

  function stream(sample = {}) {
    const item = {
      id: sample.id || `pcm-stream-${streams.length + 1}`,
      sample: sample.sample || "sample.wav",
      velocity: sample.velocity || 100,
      pan: sample.pan || 64,
      channel: sample.channel || 1,
      createdAt: new Date().toISOString(),
    };

    streams.push(item);
    activeVoices.push(item);

    return item;
  }

  function release(id) {
    const index = activeVoices.findIndex((v) => v.id === id);

    if (index >= 0) {
      activeVoices.splice(index, 1);
    }

    return snapshot();
  }

  function consume() {
    return streams.splice(0, streams.length);
  }

  function snapshot() {
    return {
      ok: true,
      streams,
      activeVoices,
      streamCount: streams.length,
      activeVoiceCount: activeVoices.length,
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    stream,
    release,
    consume,
    snapshot,
  };
}
