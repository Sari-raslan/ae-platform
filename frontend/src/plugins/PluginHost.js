export class PluginHost {
  constructor() {
    this.plugins = [];
  }

  register(plugin) {
    const item = {
      id: crypto.randomUUID(),
      name: plugin.name || "Unnamed Plugin",
      type: plugin.type || "utility",
      enabled: true,
      params: plugin.params || {},
      run: plugin.run || (() => null)
    };

    this.plugins.push(item);
    return item;
  }

  toggle(id) {
    const plugin = this.plugins.find((p) => p.id === id);
    if (plugin) plugin.enabled = !plugin.enabled;
  }

  setParam(id, name, value) {
    const plugin = this.plugins.find((p) => p.id === id);
    if (plugin) plugin.params[name] = value;
  }

  process(context = {}) {
    return this.plugins
      .filter((p) => p.enabled)
      .map((p) => ({
        plugin: p.name,
        result: p.run(context)
      }));
  }

  status() {
    return this.plugins.map((p) => ({
      id: p.id,
      name: p.name,
      type: p.type,
      enabled: p.enabled,
      params: p.params
    }));
  }
}

export const pluginHost = new PluginHost();

pluginHost.register({
  name: "Chord Helper",
  type: "arranger",
  params: { mode: "basic" },
  run: () => "Chord helper active"
});

pluginHost.register({
  name: "Velocity Humanizer",
  type: "midi",
  params: { amount: 12 },
  run: () => "Humanizer active"
});

pluginHost.register({
  name: "Stage Limiter",
  type: "audio",
  params: { ceiling: -3 },
  run: () => "Limiter active"
});
