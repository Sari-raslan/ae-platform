export function createRuntimeMidiEventBus() {
  const events = [];
  const listeners = new Map();

  function emit(type, payload = {}) {
    const event = {
      id: `midi-event-${events.length + 1}`,
      type,
      payload,
      createdAt: new Date().toISOString(),
    };

    events.push(event);

    for (const listener of listeners.get(type) || []) {
      listener(event);
    }

    for (const listener of listeners.get("*") || []) {
      listener(event);
    }

    return event;
  }

  function on(type, listener) {
    if (!listeners.has(type)) listeners.set(type, []);
    listeners.get(type).push(listener);

    return () => {
      const current = listeners.get(type) || [];
      listeners.set(
        type,
        current.filter((item) => item !== listener)
      );
    };
  }

  function history() {
    return [...events];
  }

  return {
    emit,
    on,
    history,
  };
}

export function normalizeMidiMessage(message = {}) {
  return {
    status: message.status ?? null,
    data1: message.data1 ?? null,
    data2: message.data2 ?? null,
    channel: message.channel ?? 1,
    timestamp: message.timestamp || Date.now(),
  };
}
