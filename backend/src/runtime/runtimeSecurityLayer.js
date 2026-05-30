export function createSecurityLayer() {
  const events = [];

  function authorize(action = "runtime-access") {
    const event = {
      id: `auth-${events.length + 1}`,
      action,
      status: "granted",
      createdAt: new Date().toISOString(),
    };

    events.push(event);

    return event;
  }

  function snapshot() {
    return {
      ok: true,
      events,
      eventCount: events.length,
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    authorize,
    snapshot,
  };
}
