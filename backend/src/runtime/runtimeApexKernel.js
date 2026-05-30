import { createOmegaKernel } from "./runtimeOmegaKernel.js";
import { createMetaController } from "./runtimeMetaController.js";
import { createMatrixEngine } from "./runtimeMatrixEngine.js";
import { createControlPlane } from "./runtimeControlPlane.js";
import { createSimulationGrid } from "./runtimeSimulationGrid.js";
import { createQuantumBridge } from "./runtimeQuantumBridge.js";

export function createApexKernel() {
  const omega = createOmegaKernel();

  const meta = createMetaController();
  const matrix = createMatrixEngine();
  const control = createControlPlane();
  const simulation = createSimulationGrid();
  const quantum = createQuantumBridge();

  meta.activate({
    mode: "runtime-supervisor",
  });

  matrix.compute({
    type: "arranger-analysis",
  });

  control.issue({
    type: "runtime-bootstrap",
  });

  simulation.simulate({
    name: "live-runtime",
  });

  quantum.link({
    name: "global-runtime-link",
  });

  return {
    ok: true,
    omega,
    meta: meta.snapshot(),
    matrix: matrix.snapshot(),
    control: control.snapshot(),
    simulation: simulation.snapshot(),
    quantum: quantum.snapshot(),
    generatedAt: new Date().toISOString(),
  };
}
