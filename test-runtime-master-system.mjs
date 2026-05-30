import { createRuntimeMasterSystem } from "./backend/src/runtime/runtimeMasterSystem.js";

const runtime = createRuntimeMasterSystem();

console.log(JSON.stringify(runtime, null, 2));

if (!runtime.ok) throw new Error("Master runtime failed");
if (!runtime.audio.ok) throw new Error("Audio failed");
if (!runtime.midi.ok) throw new Error("MIDI failed");
if (!runtime.workers.ok) throw new Error("Workers failed");
if (!runtime.streaming.ok) throw new Error("Streaming failed");
if (!runtime.sync.ok) throw new Error("Sync failed");

console.log("Runtime master system test passed");
