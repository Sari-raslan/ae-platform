export class RuntimeBus {
  constructor() {
    this.listeners = new Map();
    this.history = [];
  }

  on(type, callback) {
    if (!this.listeners.has(type)) this.listeners.set(type, new Set());
    this.listeners.get(type).add(callback);
    return () => this.listeners.get(type)?.delete(callback);
  }

  emit(type, payload = {}) {
    const event = {
      type,
      payload,
      time: performance.now(),
      iso: new Date().toISOString()
    };

    this.history.unshift(event);
    this.history = this.history.slice(0, 300);

    this.listeners.get(type)?.forEach((cb) => cb(event));
    this.listeners.get("*")?.forEach((cb) => cb(event));

    window.uaos?.log?.("runtime", type, payload);

    return event;
  }

  getHistory() {
    return this.history;
  }
}

export const runtimeBus = new RuntimeBus();
