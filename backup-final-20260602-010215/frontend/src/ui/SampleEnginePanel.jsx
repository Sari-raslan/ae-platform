import { useEffect, useState } from "react";
import { sampleEngine } from "../samples/SampleEngine";

export default function SampleEnginePanel() {
  const [status, setStatus] = useState(sampleEngine.status());
  const [message, setMessage] = useState("No sample loaded");

  useEffect(() => {
    const timer = setInterval(() => {
      setStatus(sampleEngine.status());
    }, 500);

    return () => clearInterval(timer);
  }, []);

  async function handleFiles(event) {
    const files = Array.from(event.target.files || []);

    if (!files.length) return;

    setMessage("Loading samples...");

    for (const file of files) {
      await sampleEngine.loadFile(file);
    }

    setStatus(sampleEngine.status());
    setMessage("Samples loaded");
  }

  function playSample(id) {
    sampleEngine.play(id);
    setStatus(sampleEngine.status());
  }

  function playLower(id) {
    sampleEngine.play(id, { pitch: 0.75, volume: 0.9 });
  }

  function playHigher(id) {
    sampleEngine.play(id, { pitch: 1.25, volume: 0.9 });
  }

  function removeSample(id) {
    sampleEngine.remove(id);
    setStatus(sampleEngine.status());
  }

  return (
    <section className="panel">
      <h2>Sample Streaming Foundation</h2>

      <div className="toolbar">
        <button onClick={() => sampleEngine.start().then(() => setStatus(sampleEngine.status()))}>
          Start Sample Engine
        </button>

        <label className="fileButton">
          Load WAV / Audio Files
          <input
            type="file"
            accept="audio/*"
            multiple
            onChange={handleFiles}
            hidden
          />
        </label>
      </div>

      <div className="grid">
        <div className="box">
          <h3>Status</h3>
          <p>State: {status.state}</p>
          <p>Sample Rate: {status.sampleRate}</p>
          <p>Loaded Samples: {status.samples.length}</p>
          <p>{message}</p>
        </div>

        <div className="box">
          <h3>Master Volume</h3>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={status.volume}
            onChange={(e) => {
              sampleEngine.setVolume(e.target.value);
              setStatus(sampleEngine.status());
            }}
          />
          <p>{status.volume}</p>
        </div>
      </div>

      <div className="box">
        <h3>Sample Slots</h3>

        {status.samples.length === 0 && <p>No samples loaded yet</p>}

        {status.samples.map((sample) => (
          <div key={sample.id} className="sampleSlot">
            <strong>{sample.name}</strong>
            <p>
              Duration: {sample.duration.toFixed(2)}s |
              Channels: {sample.channels} |
              Rate: {sample.sampleRate}
            </p>

            <div className="toolbar">
              <button onClick={() => playSample(sample.id)}>Play</button>
              <button onClick={() => playLower(sample.id)}>Pitch Down</button>
              <button onClick={() => playHigher(sample.id)}>Pitch Up</button>
              <button onClick={() => removeSample(sample.id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
