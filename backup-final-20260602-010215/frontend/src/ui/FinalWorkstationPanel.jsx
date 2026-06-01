import { useEffect, useState } from "react";
import { workstation } from "../audio/WorkstationEngine";
import { realMidi } from "../midi/RealMidi";

const keys = [["C",60],["D",62],["E",64],["F",65],["G",67],["A",69],["B",71],["C2",72]];

export default function FinalWorkstationPanel() {
  const [status, setStatus] = useState(workstation.status());
  const [events, setEvents] = useState([]);
  const [devices, setDevices] = useState({ inputs: [], outputs: [] });

  useEffect(() => {
    const off = realMidi.on((e) => {
      setEvents(old => [e, ...old].slice(0, 25));
      setStatus(workstation.status());
      if (e.type === "devices") setDevices(e.data);
    });

    const timer = setInterval(() => setStatus(workstation.status()), 500);

    return () => {
      off();
      clearInterval(timer);
    };
  }, []);

  async function start() {
    await realMidi.start();
    setStatus(workstation.status());
  }

  return (
    <section className="panel">
      <h2>Final Workstation Runtime</h2>

      <div className="toolbar">
        <button onClick={start}>Start Audio + Real MIDI</button>
        <button onClick={() => workstation.startStyle()}>Start Style</button>
        <button onClick={() => workstation.stopStyle()}>Stop Style</button>
        <button onClick={() => realMidi.panic()}>Panic</button>
        <button onClick={() => workstation.addSample("Sample Slot")}>Add Sample Slot</button>
      </div>

      <div className="grid">
        <div className="box">
          <h3>Audio</h3>
          <p>State: {status.audio}</p>
          <p>Sample Rate: {status.sampleRate}</p>
          <p>Voices: {status.voices}</p>
          <label>Volume</label>
          <input type="range" min="0" max="1" step="0.01" onChange={e => workstation.setVolume(e.target.value)} />
          <label>Filter</label>
          <input type="range" min="200" max="12000" step="10" defaultValue="9000" onChange={e => workstation.setFilter(e.target.value)} />
        </div>

        <div className="box">
          <h3>MIDI Devices</h3>
          <p>Inputs: {devices.inputs.length}</p>
          {devices.inputs.map((x, i) => <p key={i}>{x}</p>)}
          <p>Outputs: {devices.outputs.length}</p>
          {devices.outputs.map((x, i) => <p key={i}>{x}</p>)}
        </div>

        <div className="box">
          <h3>Arranger</h3>
          <p>Tempo: {status.tempo}</p>
          <input type="number" defaultValue="110" onChange={e => workstation.setTempo(e.target.value)} />
        </div>

        <div className="box">
          <h3>Samples</h3>
          <p>Slots: {status.samples}</p>
        </div>
      </div>

      <div className="box">
        <h3>Test Keyboard</h3>
        <div className="keys">
          {keys.map(([name, note]) => (
            <button key={note} onClick={() => realMidi.test(note)}>{name}</button>
          ))}
        </div>
      </div>

      <div className="box">
        <h3>Runtime Events</h3>
        <pre>{events.map(e => `${e.type} ${JSON.stringify(e.data)}`).join("\n")}</pre>
      </div>
    </section>
  );
}
