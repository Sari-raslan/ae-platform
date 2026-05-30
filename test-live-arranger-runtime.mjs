import { createLiveArrangerRuntime } from "./backend/src/runtime/liveArrangerRuntime.js";

const runtime = createLiveArrangerRuntime({
  setName: "sar.SET",
  styles: [
    { fileName: "STYLE_A.STY", bank: "A", slot: 1 },
    { fileName: "STYLE_B.STY", bank: "A", slot: 2 },
  ],
  pcm: [
    { fileName: "KICK_01.PCM", relativePath: "PCM/KICK_01.PCM" },
  ],
  songBook: [
    { name: "Demo Song", linkedStyle: "STYLE_A.STY" },
  ],
  midi: {
    clock: "internal",
    input: "web-midi",
    output: "arranger-engine",
    channel: 1,
  },
});

console.log(JSON.stringify(runtime, null, 2));

if (!runtime.ok) throw new Error("Runtime failed");
if (runtime.preload.styleQueueCount !== 2) throw new Error("Style queue failed");
if (runtime.preload.pcmCacheCount !== 1) throw new Error("PCM cache failed");
if (!runtime.midiRouting.enabled) throw new Error("MIDI routing failed");

console.log("Live arranger runtime test passed");
