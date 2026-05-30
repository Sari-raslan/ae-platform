export function createLiveMidiRouter() {
  let routes = [
    {
      source: "keyboard",
      target: "arranger",
    },
    {
      source: "pads",
      target: "sampler",
    },
  ];

  let history = [];

  function route(event = {}) {
    const routed = {
      ...event,
      routedAt: new Date().toISOString(),
    };

    history.push(routed);
    history = history.slice(-128);

    return routed;
  }

  function addRoute(source, target) {
    routes.push({ source, target });
    return snapshot();
  }

  function snapshot() {
    return {
      ok: true,
      routes,
      history,
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    route,
    addRoute,
    snapshot,
  };
}
