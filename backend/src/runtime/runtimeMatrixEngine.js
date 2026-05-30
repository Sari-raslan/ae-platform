export function createMatrixEngine() {
  const matrices = [];

  function compute(matrix = {}) {
    const entry = {
      id: `matrix-${matrices.length + 1}`,
      type: matrix.type || "runtime-matrix",
      computedAt: new Date().toISOString(),
    };

    matrices.push(entry);

    return entry;
  }

  function snapshot() {
    return {
      ok: true,
      matrices,
      matrixCount: matrices.length,
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    compute,
    snapshot,
  };
}
