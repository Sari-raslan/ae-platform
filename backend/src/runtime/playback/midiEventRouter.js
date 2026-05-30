export function createMidiEventRouter() {
  const routes = [];

  function register(route = {}) {
    const item = {
      id: route.id || `route-${routes.length + 1}`,
      type: route.type || "note-on",
      matcher: route.matcher || {},
      action: route.action || "noop",
      createdAt: new Date().toISOString(),
    };

    routes.push(item);

    return item;
  }

  function dispatch(event = {}) {
    const matched = routes.filter((route) => {
      if (route.type !== event.type) return false;

      for (const [key, value] of Object.entries(route.matcher || {})) {
        if (event[key] !== value) return false;
      }

      return true;
    });

    return {
      ok: true,
      event,
      matched,
      matchedCount: matched.length,
      generatedAt: new Date().toISOString(),
    };
  }

  function snapshot() {
    return {
      ok: true,
      routes,
      routeCount: routes.length,
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    register,
    dispatch,
    snapshot,
  };
}
