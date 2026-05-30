import { createRuntimeExecutionPlatform } from "./runtimeExecutionPlatform.js";
import { createRealtimeMidiRuntime } from "./runtimeWebMidiRealtime.js";
import { createAudioPlaybackEngine } from "./runtimeAudioPlayback.js";
import { createStylePlaybackEngine } from "./runtimeStylePlayback.js";
import { createRealtimeScheduler } from "./runtimeRealtimeScheduler.js";
import { createDeploymentBridge } from "./runtimeDeploymentBridge.js";

export function createFinalRuntimeKernel() {
  const execution = createRuntimeExecutionPlatform();
  const midi = createRealtimeMidiRuntime();
  const audio = createAudioPlaybackEngine();
  const playback = createStylePlaybackEngine();
  const scheduler = createRealtimeScheduler();
  const deployment = createDeploymentBridge();

  return {
    ok: true,
    execution,
    midi: midi.snapshot(),
    audio: audio.snapshot(),
    playback: playback.snapshot(),
    scheduler: scheduler.snapshot(),
    deployment,
    generatedAt: new Date().toISOString(),
  };
}
