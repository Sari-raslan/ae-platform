import { createRuntimeExecutionPlatform } from "./backend/src/runtime/runtimeExecutionPlatform.js";

const platform = createRuntimeExecutionPlatform();

console.log(JSON.stringify(platform, null, 2));

if (!platform.ok) throw new Error("Execution platform failed");
if (!platform.master.ok) throw new Error("Master runtime failed");
if (!platform.midi.ok) throw new Error("MIDI bridge failed");
if (!platform.scheduler.ok) throw new Error("Scheduler failed");
if (!platform.hardware.ok) throw new Error("Hardware bridge failed");
if (!platform.session.ok) throw new Error("Session failed");

console.log("Runtime execution platform test passed");
