import { createFinalRuntimeKernel } from "./backend/src/runtime/runtimeFinalKernel.js";

const kernel = createFinalRuntimeKernel();

console.log(JSON.stringify(kernel, null, 2));

if (!kernel.ok) throw new Error("Kernel failed");
if (!kernel.execution.ok) throw new Error("Execution failed");
if (!kernel.midi.ok) throw new Error("MIDI failed");
if (!kernel.audio.ok) throw new Error("Audio failed");
if (!kernel.playback.ok) throw new Error("Playback failed");
if (!kernel.scheduler.ok) throw new Error("Scheduler failed");

console.log("Final runtime kernel test passed");
