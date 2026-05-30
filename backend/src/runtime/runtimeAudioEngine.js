export function createRuntimeAudioEngine({
  sampleRate = 44100,
  bufferSize = 512,
} = {}) {
  let running = false;

  function start() {
    running = true;
    return snapshot();
  }

  function stop() {
    running = false;
    return snapshot();
  }

  function snapshot() {
    return {
      ok: true,
      running,
      sampleRate,
      bufferSize,
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    start,
    stop,
    snapshot,
  };
}
