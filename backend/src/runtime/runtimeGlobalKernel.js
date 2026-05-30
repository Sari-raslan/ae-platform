import { createFinalRuntimeKernel } from "./runtimeFinalKernel.js";
import { createAiConductor } from "./runtimeAiConductor.js";
import { createCloudSync } from "./runtimeCloudSync.js";
import { createSecurityLayer } from "./runtimeSecurityLayer.js";
import { createPluginHost } from "./runtimePluginHost.js";
import { createTelemetrySystem } from "./runtimeTelemetry.js";

export function createGlobalRuntimeKernel() {
  const kernel = createFinalRuntimeKernel();
  const ai = createAiConductor();
  const cloud = createCloudSync();
  const security = createSecurityLayer();
  const plugins = createPluginHost();
  const telemetry = createTelemetrySystem();

  ai.analyze();
  cloud.push();
  security.authorize();
  plugins.register({
    name: "Experimental Runtime Plugin",
  });
  telemetry.track({
    type: "runtime-start",
  });

  return {
    ok: true,
    kernel,
    ai: ai.snapshot(),
    cloud: cloud.snapshot(),
    security: security.snapshot(),
    plugins: plugins.snapshot(),
    telemetry: telemetry.snapshot(),
    generatedAt: new Date().toISOString(),
  };
}
