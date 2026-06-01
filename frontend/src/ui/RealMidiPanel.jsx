import { useEffect, useState } from "react";
import { midiEngine } from "../midi/MidiEngine";
import { audioEngine } from "../audio/AudioEngine";

const testNotes = [
  ["C", 60],
  ["D", 62],
  ["E", 64],
  ["F", 65],
  ["G", 67],
  ["A", 69],
  ["B", 71],
  ["C2", 72]
];

export default function RealMidiPanel() {
  const [status, setStatus] = useState("Not started");
  const [devices, setDevices] = useState({ inputs: [], outputs: [] });
  const [events, setEvents] = useState([]);
  const [activeNotes, setActiveNotes] = useState([]);
  const [audio, setAudio] = useState(audioEngine.status());

  useEffect(() => {
    const off = midiEngine.on((event) => {
      setEvents((old) => [event, ...old].slice(0, 30));
      setAudio(audioEngine.status());

      if (event.type === "midi:devices") {
        setDevices(event.payload);
      }

      if (event.type === "midi:ready") {
        setStatus("MIDI Ready");
      }

      if (event.type === "midi:error") {
        setStatus(event.payload.message);
      }

      if (event.type === "midi:noteon" || event.type === "midi:noteoff") {
        setActiveNotes(event.payload.activeNotes || []);
      }
    });

    return () => off();
  }, []);

  async function startMidi() {
    setStatus("Starting...");
    await midiEngine.start();
    setAudio(audioEngine.status());
  }

  return (
    <section className="panel">
      <h2>Real MIDI Runtime</h2>

      <div className="toolbar">
        <button onClick={startMidi}>Start Real MIDI</button>
        <button onClick={() => midiEngine.panic()}>Panic / All Notes Off</button>
      </div>

      <div className="grid">
        <div className="box">
          <h3>Status</h3>
          <p>{status}</p>
          <p>Audio: {audio.state}</p>
          <p>Sample Rate: {audio.sampleRate}</p>
          <p>Active Voices: {audio.activeVoices}</p>
        </div>

        <div className="box">
          <h3>Active Notes</h3>
          <p>{activeNotes.length ? activeNotes.join(", ") : "None"}</p>
        </div>

        <div className="box">
          <h3>MIDI Inputs</h3>
          {devices.inputs.length === 0 && <p>No MIDI inputs detected</p>}
          {devices.inputs.map((input) => (
            <p key={input.id}>{input.name || "Unknown Input"}  {input.state}</p>
          ))}
        </div>

        <div className="box">
          <h3>MIDI Outputs</h3>
          {devices.outputs.length === 0 && <p>No MIDI outputs detected</p>}
          {devices.outputs.map((output) => (
            <p key={output.id}>{output.name || "Unknown Output"}  {output.state}</p>
          ))}
        </div>
      </div>

      <div className="box">
        <h3>Audio Test Keyboard</h3>
        <div className="keys">
          {testNotes.map(([name, note]) => (
            <button key={note} onClick={() => midiEngine.testNote(note)}>
              {name}
            </button>
          ))}
        </div>
      </div>

      <div className="box">
        <h3>Recent MIDI Events</h3>
        <pre>
          {events.map((event) =>
            `${event.type} ${JSON.stringify(event.payload)}`
          ).join("\n")}
        </pre>
      </div>
    </section>
  );
}
