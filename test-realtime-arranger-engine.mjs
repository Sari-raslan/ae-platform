import { createRealtimeArrangerEngine } from "./backend/src/runtime/runtimeRealtimeEngine.js";

const engine = createRealtimeArrangerEngine({
  runtime: {
    preload: {
      styleQueueCount: 1,
      pcmCacheCount: 1,
      stylePreloadQueue: [
        {
          id: "style-1",
          name: "STYLE_A.STY",
          bank: "A",
          slot: 1,
        },
      ],
    },
    transport: {
      state: "stopped",
      tempo: 120,
      clock: "internal",
    },
    health: {
      status: "experimental-ready",
    },
  },
});

const started = engine.start();
const switched = engine.switchStyle("style-1");
const midi = engine.receiveMidi({
  status: 144,
  data1: 60,
  data2: 100,
  channel: 1,
});
const stopped = engine.stop();
const status = engine.getStatus();

console.log(JSON.stringify({ started, switched, midi, stopped, status }, null, 2));

if (!started.ok) throw new Error("Engine start failed");
if (!switched.styleState.activeStyle) throw new Error("Style switch failed");
if (!midi.ok) throw new Error("MIDI receive failed");
if (!stopped.ok) throw new Error("Engine stop failed");
if (!status.performance.ok) throw new Error("Performance monitor failed");

console.log("Realtime arranger engine test passed");
