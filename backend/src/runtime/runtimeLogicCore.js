export function createLogicCore() {
  const operations = [];

  function execute(operation = {}) {
    const result = {
      id: `logic-${operations.length + 1}`,
      type: operation.type || "runtime-op",
      completedAt: new Date().toISOString(),
    };

    operations.push(result);

    return result;
  }

  function snapshot() {
    return {
      ok: true,
      operations,
      operationCount: operations.length,
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    execute,
    snapshot,
  };
}
