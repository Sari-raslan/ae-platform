export function createPluginHost() {
  const plugins = [];

  function register(plugin = {}) {
    const item = {
      id: plugin.id || `plugin-${plugins.length + 1}`,
      name: plugin.name || "Unknown Plugin",
      loadedAt: new Date().toISOString(),
    };

    plugins.push(item);

    return item;
  }

  function snapshot() {
    return {
      ok: true,
      plugins,
      pluginCount: plugins.length,
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    register,
    snapshot,
  };
}
