import { createUniverseKernel } from "./runtimeUniverseKernel.js";
import { createClusterManager } from "./runtimeClusterManager.js";
import { createRenderEngine } from "./runtimeRenderEngine.js";
import { createTransportBus } from "./runtimeTransportBus.js";
import { createMonitoringCenter } from "./runtimeMonitoringCenter.js";
import { createStorageGateway } from "./runtimeStorageGateway.js";

export function createInfiniteKernel() {
  const universe = createUniverseKernel();

  const cluster = createClusterManager();
  const render = createRenderEngine();
  const transport = createTransportBus();
  const monitor = createMonitoringCenter();
  const storage = createStorageGateway();

  cluster.register({
    role: "master-runtime",
  });

  render.render({
    name: "main-runtime-scene",
  });

  transport.dispatch({
    type: "runtime-start",
  });

  monitor.alert({
    level: "info",
    message: "runtime-operational",
  });

  storage.write({
    type: "runtime-record",
  });

  return {
    ok: true,
    universe,
    cluster: cluster.snapshot(),
    render: render.snapshot(),
    transport: transport.snapshot(),
    monitor: monitor.snapshot(),
    storage: storage.snapshot(),
    generatedAt: new Date().toISOString(),
  };
}
