import { createRuntimeAudioEngine } from "./runtimeAudioEngine.js";
import { createRuntimeMidiRouter } from "./runtimeMidiRouter.js";
import { createRuntimeWorkerThreads } from "./runtimeWorkerThreads.js";
import { createRuntimeStreamingLayer } from "./runtimeStreaming.js";
import { createMultiDeviceSync } from "./runtimeMultiDeviceSync.js";

export function createRuntimeMasterSystem() {
  const audio = createRuntimeAudioEngine();
  const midi = createRuntimeMidiRouter();
  const workers = createRuntimeWorkerThreads();
  const streaming = createRuntimeStreamingLayer();
  const sync = createMultiDeviceSync();

  return {
    ok: true,
    audio: audio.snapshot(),
    midi: midi.snapshot(),
    workers: workers.snapshot(),
    streaming: streaming.snapshot(),
    sync: sync.snapshot(),
    generatedAt: new Date().toISOString(),
  };
}
