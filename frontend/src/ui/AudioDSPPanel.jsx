import { useEffect, useState } from "react";
import { audioDSP } from "../audio/AudioDSP";
import { midiEngine } from "../midi/MidiEngine";

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

const waveforms = ["sine", "triangle", "square", "sawtooth"];

export default function AudioDSPPanel() {
  const [status, setStatus] = useState(audioDSP.status());
  const [events, setEvents] = useState([]);
  const [devices, setDevices] = useState({ inputs: [], outputs: [] });

  useEffect(() => {
    const off = midiEngine.on((event) => {
      setEvents((old) => [event, ...old].slice(0, 25));
      setStatus(audioDSP.status());

      if (event.type === "midi:devices") {
        setDevices(event.payload);
      }
    });

    const timer = setInterval(() => {
      setStatus(audioDSP.status());
    }, 500);

    return () => {
      off();
      clearInterval(timer);
    };
  }, []);

  async function startRuntime() {
    await midiEngine.start();
    setStatus(audioDSP.status());
  }

  function setParam(name, value) {
    audioDSP.setParam(name, value);
    setStatus(audioDSP.status());
  }

  function setWaveform(type) {
    audioDSP.setWaveform(type);
    setStatus(audioDSP.status());
  }

  return (
    <section className="panel">
      <h2>Audio DSP Engine</h2>

      <div className="toolbar">
        <button onClick={startRuntime}>Start Audio + MIDI</button>
        <button onClick={() => midiEngine.panic()}>Panic</button>
      </div>

      <div className="grid">
        <div className="box">
          <h3>DSP Status</h3>
          <p>State: {status.state}</p>
          <p>Sample Rate: {status.sampleRate}</p>
          <p>Active Voices: {status.activeVoices}</p>
        </div>

        <div className="box">
          <h3>MIDI Inputs</h3>
          {devices.inputs.length === 0 && <p>No MIDI inputs detected</p>}
          {devices.inputs.map((input) => (
            <p key={input.id}>{input.name}  {input.state}</p>
          ))}
        </div>

        <div className="box">
          <h3>Master / Filter</h3>

          <label>
            Master Volume {status.masterVolume}
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={status.masterVolume}
              onChange={(e) => setParam("masterVolume", e.target.value)}
            />
          </label>

          <label>
            Filter Freq {status.filterFreq}
            <input
              type="range"
              min="200"
              max="12000"
              step="10"
              value={status.filterFreq}
              onChange={(e) => setParam("filterFreq", e.target.value)}
            />
          </label>

          <label>
            Filter Q {status.filterQ}
            <input
              type="range"
              min="0.1"
              max="12"
              step="0.1"
              value={status.filterQ}
              onChange={(e) => setParam("filterQ", e.target.value)}
            />
          </label>
        </div>

        <div className="box">
          <h3>FX</h3>

          <label>
            Delay Time {status.delayTime}
            <input
              type="range"
              min="0"
              max="0.8"
              step="0.01"
              value={status.delayTime}
              onChange={(e) => setParam("delayTime", e.target.value)}
            />
          </label>

          <label>
            Delay Feedback {status.delayFeedback}
            <input
              type="range"
              min="0"
              max="0.8"
              step="0.01"
              value={status.delayFeedback}
              onChange={(e) => setParam("delayFeedback", e.target.value)}
            />
          </label>

          <label>
            Reverb Mix {status.reverbMix}
            <input
              type="range"
              min="0"
              max="0.7"
              step="0.01"
              value={status.reverbMix}
              onChange={(e) => setParam("reverbMix", e.target.value)}
            />
          </label>
        </div>
      </div>

      <div className="box">
        <h3>Waveform</h3>
        <div className="keys">
          {waveforms.map((wave) => (
            <button key={wave} onClick={() => setWaveform(wave)}>
              {wave}
            </button>
          ))}
        </div>
      </div>

      <div className="box">
        <h3>Test Keyboard</h3>
        <div className="keys">
          {notes.map(([name, note]) => (
            <button key={note} onClick={() => midiEngine.testNote(note)}>
              {name}
            </button>
          ))}
        </div>
      </div>

      <div className="box">
        <h3>Recent Events</h3>
        <pre>
          {events.map((event) =>
            `${event.type} ${JSON.stringify(event.payload)}`
          ).join("\n")}
        </pre>
      </div>
    </section>
  );
}
