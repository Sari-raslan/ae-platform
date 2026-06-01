import { useEffect, useState } from "react";
import { audioWorkletEngine } from "../audio/AudioWorkletEngine";

const notes = [
  ["C", 60],
  ["D", 62],
  ["E", 64],
  ["F", 65],
  ["G", 67],
  ["A", 69],
  ["B", 71],
  ["C2", 72]
];

const waves = ["sine", "triangle", "square", "sawtooth"];

export default function AudioWorkletPanel() {
  const [status, setStatus] = useState(audioWorkletEngine.status());

  useEffect(() => {
    const timer = setInterval(() => {
      setStatus(audioWorkletEngine.status());
    }, 500);

    return () => clearInterval(timer);
  }, []);

  async function start() {
    await audioWorkletEngine.start();
    setStatus(audioWorkletEngine.status());
  }

  function setParam(name, value) {
    audioWorkletEngine.setParam(name, value);
    setStatus(audioWorkletEngine.status());
  }

  function testNote(note) {
    audioWorkletEngine.noteOn(note, 110);
    setTimeout(() => audioWorkletEngine.noteOff(note), 400);
  }

  return (
    <section className="panel">
      <h2>AudioWorklet DSP Foundation</h2>

      <div className="toolbar">
        <button onClick={start}>Start AudioWorklet DSP</button>
        <button onClick={() => audioWorkletEngine.panic()}>Panic</button>
      </div>

      <div className="grid">
        <div className="box">
          <h3>Status</h3>
          <p>State: {status.state}</p>
          <p>Sample Rate: {status.sampleRate}</p>
          <p>Voices: {status.activeVoices}</p>
        </div>

        <div className="box">
          <h3>DSP Parameters</h3>

          <label>Gain {status.gain}</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={status.gain}
            onChange={(e) => setParam("gain", e.target.value)}
          />

          <label>Drive {status.drive}</label>
          <input
            type="range"
            min="0.5"
            max="8"
            step="0.1"
            value={status.drive}
            onChange={(e) => setParam("drive", e.target.value)}
          />

          <label>Lowpass {status.lowpass}</label>
          <input
            type="range"
            min="0.01"
            max="1"
            step="0.01"
            value={status.lowpass}
            onChange={(e) => setParam("lowpass", e.target.value)}
          />
        </div>
      </div>

      <div className="box">
        <h3>Waveform</h3>
        <div className="keys">
          {waves.map((wave) => (
            <button
              key={wave}
              onClick={() => {
                audioWorkletEngine.setWaveform(wave);
                setStatus(audioWorkletEngine.status());
              }}
            >
              {wave}
            </button>
          ))}
        </div>
      </div>

      <div className="box">
        <h3>Test Keyboard</h3>
        <div className="keys">
          {notes.map(([name, note]) => (
            <button key={note} onClick={() => testNote(note)}>
              {name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
