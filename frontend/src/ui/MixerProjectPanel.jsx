import { useEffect, useState } from "react";
import { engine } from "../audio/FullWorkstationEngine";
import { projectManager } from "../project/ProjectManager";

const keys = [
  ["C", 60],
  ["D", 62],
  ["E", 64],
  ["F", 65],
  ["G", 67],
  ["A", 69],
  ["B", 71],
  ["C2", 72]
];

export default function MixerProjectPanel() {
  const [status, setStatus] = useState(engine.status());

  useEffect(() => {
    const timer = setInterval(() => {
      setStatus(engine.status());
    }, 500);

    return () => clearInterval(timer);
  }, []);

  async function start() {
    await engine.start();
    setStatus(engine.status());
  }

  async function loadSamples(e) {
    const files = Array.from(e.target.files || []);
    for (const file of files) {
      await engine.loadSample(file);
    }
    setStatus(engine.status());
  }

  async function loadProject(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = await projectManager.load(file);
    engine.importProject(data);
    setStatus(engine.status());
  }

  function saveProject() {
    projectManager.save(engine.exportProject());
  }

  return (
    <section className="panel">
      <h2>Professional Mixer + Project System</h2>

      <div className="toolbar">
        <button onClick={start}>Start Engine</button>
        <button onClick={() => engine.startStyle()}>Start Arranger</button>
        <button onClick={() => engine.stopStyle()}>Stop Arranger</button>
        <button onClick={() => engine.panic()}>Panic</button>
        <button onClick={saveProject}>Save Project</button>

        <label className="fileButton">
          Load Project
          <input type="file" accept=".json,.uaosproject" hidden onChange={loadProject} />
        </label>

        <label className="fileButton">
          Load Samples
          <input type="file" accept="audio/*" multiple hidden onChange={loadSamples} />
        </label>
      </div>

      <div className="grid">
        <div className="box">
          <h3>Audio Status</h3>
          <p>State: {status.audio}</p>
          <p>Sample Rate: {status.sampleRate}</p>
          <p>Voices: {status.voices}</p>
          <p>Tempo: {status.tempo}</p>
          <input
            type="number"
            value={status.tempo}
            onChange={(e) => {
              engine.setTempo(e.target.value);
              setStatus(engine.status());
            }}
          />
        </div>

        <div className="box">
          <h3>Mixer Channels</h3>

          {status.mixer.channels.map((channel) => (
            <div key={channel.name} className="channelStrip">
              <strong>{channel.name}</strong>

              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={channel.volume}
                onChange={(e) => {
                  engine.setMixerVolume(channel.name, e.target.value);
                  setStatus(engine.status());
                }}
              />

              <div className="toolbar">
                <button
                  onClick={() => {
                    engine.setMixerMute(channel.name, !channel.muted);
                    setStatus(engine.status());
                  }}
                >
                  {channel.muted ? "Unmute" : "Mute"}
                </button>

                <button
                  onClick={() => {
                    engine.setMixerSolo(channel.name, !channel.solo);
                    setStatus(engine.status());
                  }}
                >
                  {channel.solo ? "Unsolo" : "Solo"}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="box">
          <h3>Test Keyboard</h3>
          <div className="keys">
            {keys.map(([name, note]) => (
              <button
                key={note}
                onClick={() => {
                  engine.noteOn(note, 100, "lead");
                  setTimeout(() => engine.noteOff(note, "lead"), 350);
                }}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        <div className="box">
          <h3>Samples</h3>
          <p>Loaded: {status.samples.length}</p>

          {status.samples.map((s) => (
            <div key={s.id} className="sampleSlot">
              <strong>{s.name}</strong>
              <p>{s.duration.toFixed(2)}s | {s.channels}ch</p>

              <div className="toolbar">
                <button onClick={() => engine.playSample(s.id, 1)}>Play</button>
                <button onClick={() => engine.playSample(s.id, 0.75)}>Down</button>
                <button onClick={() => engine.playSample(s.id, 1.25)}>Up</button>
                <button
                  onClick={() => {
                    engine.removeSample(s.id);
                    setStatus(engine.status());
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
