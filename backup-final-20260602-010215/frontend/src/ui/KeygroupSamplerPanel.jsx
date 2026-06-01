import { useEffect, useState } from "react";
import { keygroupSampler } from "../sampler/KeygroupSampler";

const keyboard = [
  ["C", 60],
  ["D", 62],
  ["E", 64],
  ["F", 65],
  ["G", 67],
  ["A", 69],
  ["B", 71],
  ["C2", 72]
];

export default function KeygroupSamplerPanel() {
  const [status, setStatus] = useState(keygroupSampler.status());
  const [config, setConfig] = useState({
    rootNote: 60,
    lowNote: 0,
    highNote: 127,
    lowVelocity: 1,
    highVelocity: 127,
    volume: 1
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setStatus(keygroupSampler.status());
    }, 500);

    return () => clearInterval(timer);
  }, []);

  async function start() {
    await keygroupSampler.start();
    setStatus(keygroupSampler.status());
  }

  async function loadFiles(event) {
    const files = Array.from(event.target.files || []);

    for (const file of files) {
      await keygroupSampler.loadSampleFile(file, config);
    }

    setStatus(keygroupSampler.status());
  }

  function updateConfig(name, value) {
    setConfig((old) => ({
      ...old,
      [name]: value
    }));
  }

  function updateKg(id, name, value) {
    keygroupSampler.updateKeygroup(id, {
      [name]: value
    });

    setStatus(keygroupSampler.status());
  }

  function saveMap() {
    const data = keygroupSampler.exportMap();

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json"
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "uaos-keygroup-map.json";
    a.click();

    URL.revokeObjectURL(url);
  }

  return (
    <section className="panel">
      <h2>Sample Keygroups + Velocity Layers</h2>

      <div className="toolbar">
        <button onClick={start}>Start Sampler</button>
        <button onClick={() => keygroupSampler.stopAll()}>Stop All</button>
        <button onClick={saveMap}>Export Keygroup Map</button>

        <label className="fileButton">
          Load Samples
          <input type="file" accept="audio/*" multiple hidden onChange={loadFiles} />
        </label>
      </div>

      <div className="grid">
        <div className="box">
          <h3>Sampler Status</h3>
          <p>State: {status.state}</p>
          <p>Sample Rate: {status.sampleRate}</p>
          <p>Keygroups: {status.keygroups.length}</p>
          <p>Active Sources: {status.activeSources}</p>

          <label>Master Volume</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={status.masterVolume}
            onChange={(e) => {
              keygroupSampler.setMasterVolume(e.target.value);
              setStatus(keygroupSampler.status());
            }}
          />
        </div>

        <div className="box">
          <h3>New Sample Mapping</h3>

          <label>Root Note</label>
          <input type="number" value={config.rootNote} onChange={(e) => updateConfig("rootNote", e.target.value)} />

          <label>Low Note</label>
          <input type="number" value={config.lowNote} onChange={(e) => updateConfig("lowNote", e.target.value)} />

          <label>High Note</label>
          <input type="number" value={config.highNote} onChange={(e) => updateConfig("highNote", e.target.value)} />

          <label>Low Velocity</label>
          <input type="number" value={config.lowVelocity} onChange={(e) => updateConfig("lowVelocity", e.target.value)} />

          <label>High Velocity</label>
          <input type="number" value={config.highVelocity} onChange={(e) => updateConfig("highVelocity", e.target.value)} />

          <label>Volume</label>
          <input type="number" step="0.01" value={config.volume} onChange={(e) => updateConfig("volume", e.target.value)} />
        </div>
      </div>

      <div className="box">
        <h3>Test Keyboard</h3>
        <div className="keys">
          {keyboard.map(([name, note]) => (
            <button key={note} onClick={() => keygroupSampler.play(note, 100)}>
              {name}
            </button>
          ))}
        </div>
      </div>

      <div className="box">
        <h3>Keygroups</h3>

        {status.keygroups.length === 0 && <p>No keygroups loaded</p>}

        {status.keygroups.map((kg) => (
          <div key={kg.id} className="track">
            <h4>{kg.name}</h4>
            <p>{kg.duration.toFixed(2)}s | {kg.channels}ch | {kg.sampleRate}Hz</p>

            <div className="grid">
              <label>
                Root
                <input type="number" value={kg.rootNote} onChange={(e) => updateKg(kg.id, "rootNote", e.target.value)} />
              </label>

              <label>
                Low Note
                <input type="number" value={kg.lowNote} onChange={(e) => updateKg(kg.id, "lowNote", e.target.value)} />
              </label>

              <label>
                High Note
                <input type="number" value={kg.highNote} onChange={(e) => updateKg(kg.id, "highNote", e.target.value)} />
              </label>

              <label>
                Low Vel
                <input type="number" value={kg.lowVelocity} onChange={(e) => updateKg(kg.id, "lowVelocity", e.target.value)} />
              </label>

              <label>
                High Vel
                <input type="number" value={kg.highVelocity} onChange={(e) => updateKg(kg.id, "highVelocity", e.target.value)} />
              </label>

              <label>
                Vol
                <input type="number" step="0.01" value={kg.volume} onChange={(e) => updateKg(kg.id, "volume", e.target.value)} />
              </label>
            </div>

            <div className="toolbar">
              <button onClick={() => keygroupSampler.play(kg.rootNote, 100)}>Play Root</button>
              <button
                onClick={() => {
                  keygroupSampler.removeKeygroup(kg.id);
                  setStatus(keygroupSampler.status());
                }}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
