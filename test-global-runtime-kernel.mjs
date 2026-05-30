import { createGlobalRuntimeKernel } from "./backend/src/runtime/runtimeGlobalKernel.js";

const kernel = createGlobalRuntimeKernel();

console.log(JSON.stringify(kernel, null, 2));

if (!kernel.ok) throw new Error("Global kernel failed");
if (!kernel.kernel.ok) throw new Error("Final kernel failed");
if (!kernel.ai.ok) throw new Error("AI failed");
if (!kernel.cloud.ok) throw new Error("Cloud failed");
if (!kernel.security.ok) throw new Error("Security failed");
if (!kernel.plugins.ok) throw new Error("Plugins failed");
if (!kernel.telemetry.ok) throw new Error("Telemetry failed");

console.log("Global runtime kernel test passed");
