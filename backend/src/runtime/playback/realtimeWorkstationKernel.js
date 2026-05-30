import { createRealtimeStyleRenderer } from "./realtimeStyleRenderer.js";
import { createMidiEventRouter } from "./midiEventRouter.js";
import { createStyleMemoryBank } from "./styleMemoryBank.js";
import { createPerformanceSnapshotSystem } from "./performanceSnapshotSystem.js";
import { createLivePadTriggerEngine } from "./livePadTriggerEngine.js";
import { createSongPositionClock } from "./songPositionClock.js";

export function createRealtimeWorkstationKernel() {
  const renderer = createRealtimeStyleRenderer();
  const router = createMidiEventRouter();
  const memory = createStyleMemoryBank();
  const snapshots = createPerformanceSnapshotSystem();
  const pads = createLivePadTriggerEngine();
  const songClock = createSongPositionClock();

  pads.assign(1, "kick.wav");
  pads.assign(2, "snare.wav");
  pads.assign(3, "crash.wav");

  router.register({
    type: "note-on",
    matcher: { note: 60 },
    action: "START",
  });

  router.register({
    type: "note-on",
    matcher: { note: 61 },
    action: "STOP",
  });

  memory.save({
    id: "style-demo",
    name: "Realtime Demo Style",
    tempo: 120,
    variation: "VAR1",
  });

  function start() {
    renderer.start();
    return snapshot();
  }

  function stop() {
    renderer.stop();
    return snapshot();
  }

  function pulse() {
    renderer.pulse(1);
    songClock.advance(24);

    snapshots.capture({
      renderer: renderer.snapshot(),
      songClock: songClock.snapshot(),
    });

    return snapshot();
  }

  function routeMidi(event = {}) {
    return router.dispatch(event);
  }

  function triggerPad(index = 1) {
    return pads.trigger(index);
  }

  function snapshot() {
    return {
      ok: true,
      renderer: renderer.snapshot(),
      midiRouter: router.snapshot(),
      memory: memory.snapshot(),
      snapshots: snapshots.snapshot(),
      pads: pads.snapshot(),
      songClock: songClock.snapshot(),
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    start,
    stop,
    pulse,
    routeMidi,
    triggerPad,
    snapshot,
  };
}
