import { createRealtimeStyleRenderer } from "../playback/realtimeStyleRenderer.js";
import { createLiveAudioOutputEngine } from "./liveAudioOutputEngine.js";

export function createRealtimeExecutionRuntime() {
  const renderer = createRealtimeStyleRenderer();
  const audio = createLiveAudioOutputEngine();

  function start() {
    renderer.start();
    return snapshot();
  }

  function stop() {
    renderer.stop();
    return snapshot();
  }

  function pulse(ticks = 1) {
    renderer.pulse(ticks);

    const state = renderer.snapshot();

    const recent = state.renderedEvents.slice(-16);

    audio.render(recent);

    return snapshot();
  }

  function snapshot() {
    return {
      ok: true,
      renderer: renderer.snapshot(),
      audio: audio.snapshot(),
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    start,
    stop,
    pulse,
    snapshot,
  };
}
