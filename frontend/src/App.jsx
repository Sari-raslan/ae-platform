import "./style.css";
import { useState } from "react";
import { pluginHost } from "./plugins/PluginHost";
import { factoryPresets } from "./presets/FactoryPresets";

export default function App() {
  const [plugins, setPlugins] = useState(pluginHost.status());
  const [preset, setPreset] = useState(factoryPresets[0]);
  const [log, setLog] = useState([]);

  function refresh() {
    setPlugins(pluginHost.status());
  }

  function runPlugins() {
    const result = pluginHost.process({ preset });
    setLog((old) => [result, ...old].slice(0, 10));
  }

  function loadPreset(id) {
    const found = factoryPresets.find((p) => p.id === id);
    if (found) setPreset(found);
  }

  return (
    <main>
      <h1>Universal Arranger OS</h1>
      <p className="ok">Plugin Host + Preset System Online</p>

      <section className="panel">
        <h2>Performance Presets</h2>

        <div className="box">
          <select value={preset.id} onChange={(e) => loadPreset(e.target.value)}>
            {factoryPresets.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <p>Tempo: {preset.tempo}</p>
          <p>Volume: {preset.volume}</p>
          <p>Filter: {preset.filter}</p>
        </div>

        <h2>Plugin Host</h2>

        <div className="grid">
          {plugins.map((plugin) => (
            <div className="box" key={plugin.id}>
              <h3>{plugin.name}</h3>
              <p>Type: {plugin.type}</p>
              <p>Enabled: {String(plugin.enabled)}</p>

              <button onClick={() => {
                pluginHost.toggle(plugin.id);
                refresh();
              }}>
                Toggle
              </button>

              <pre>{JSON.stringify(plugin.params, null, 2)}</pre>
            </div>
          ))}
        </div>

        <div className="toolbar">
          <button onClick={runPlugins}>Run Plugin Chain</button>
        </div>

        <div className="box">
          <h3>Plugin Output</h3>
          <pre>{log.map((x) => JSON.stringify(x, null, 2)).join("\n\n")}</pre>
        </div>
      </section>
    </main>
  );
}
