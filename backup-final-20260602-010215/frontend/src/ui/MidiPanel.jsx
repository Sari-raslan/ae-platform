import { useEffect, useState } from "react";
import { midiEngine } from "../midi/MidiEngine";

export default function MidiPanel() {
  const [status, setStatus] = useState("Not initialized");
  const [devices, setDevices] = useState({ inputs: [], outputs: [] });
  const [events, setEvents] = useState([]);
  const [activeNotes, setActiveNotes] = useState([]);

  useEffect(() => {
    const off = midiEngine.onEvent((event) => {
      setEvents((old) => [event, ...old].slice(0, 20));

      if (event.type === "midi:devices") {
        setDevices(event.data);
      }

      if (event.type === "midi:ready") {
        setStatus("MIDI Ready");
      }

      if (event.type === "midi:error") {
        setStatus("MIDI Error: " + event.data.message);
      }

      if (event.type === "midi:noteon" || event.type === "midi:noteoff") {
        setActiveNotes(event.data.activeNotes || []);
      }
    });

    midiEngine.initialize();

    return () => off();
  }, []);

  return (
    <section className="panel">
      <h2>Real MIDI Runtime</h2>

      <p>Status: <strong>{status}</strong></p>

      <div className="grid">
        <div className="box">
          <h3>MIDI Inputs</h3>
          {devices.inputs.length === 0 && <p>No MIDI inputs detected</p>}
          {devices.inputs.map((input) => (
            <p key={input.id}>
              {input.name || "Unknown Input"}  {input.state}
            </p>
          ))}
        </div>

        <div className="box">
          <h3>MIDI Outputs</h3>
          {devices.outputs.length === 0 && <p>No MIDI outputs detected</p>}
          {devices.outputs.map((output) => (
            <p key={output.id}>
              {output.name || "Unknown Output"}  {output.state}
            </p>
          ))}
        </div>
      </div>

      <div className="box">
        <h3>Active Notes</h3>
        <p>{activeNotes.length ? activeNotes.join(", ") : "None"}</p>
      </div>

      <div className="box">
        <h3>Recent MIDI Events</h3>
        <pre>
          {events.map((event) =>
            `${event.type} ${JSON.stringify(event.data)}`
          ).join("\n")}
        </pre>
      </div>
    </section>
  );
}
