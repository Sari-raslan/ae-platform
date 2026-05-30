export function createTransportBus() {
  const messages = [];

  function dispatch(message = {}) {
    const entry = {
      id: `transport-${messages.length + 1}`,
      type: message.type || "runtime-message",
      createdAt: new Date().toISOString(),
    };

    messages.push(entry);

    return entry;
  }

  function snapshot() {
    return {
      ok: true,
      messages,
      messageCount: messages.length,
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    dispatch,
    snapshot,
  };
}
