export function createAudioPlaybackEngine() {
  let active = false;
  const playback = [];

  function play(sample = {}) {
    active = true;

    const event = {
      id: `play-${playback.length + 1}`,
      sample: sample.name || "Unknown",
      startedAt: new Date().toISOString(),
    };

    playback.push(event);

    return event;
  }

  function stop() {
    active = false;

    return snapshot();
  }

  function snapshot() {
    return {
      ok: true,
      active,
      playback,
      playbackCount: playback.length,
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    play,
    stop,
    snapshot,
  };
}
