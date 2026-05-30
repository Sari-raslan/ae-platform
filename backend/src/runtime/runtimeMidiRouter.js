export function createRuntimeMidiRouter() {
  const routes = [];

  function connect(input, output) {
    routes.push({
      input,
      output,
      connectedAt: new Date().toISOString(),
    });

    return snapshot();
  }

  function snapshot() {
    return {
      ok: true,
      routeCount: routes.length,
      routes,
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    connect,
    snapshot,
  };
}
