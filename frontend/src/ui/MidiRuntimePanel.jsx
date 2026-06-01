import { useEffect, useState } from "react";
import { runtimeBus } from "../runtime/runtimeBus";
import { midiRuntime } from "../midi/midiRuntime";

const notes = [
  ["C", 60], ["D", 62], ["E", 64], ["F", 65],
  ["G", 67], ["A", 69], ["B", 71], ["C2", 72]
];

export default function MidiRuntimePanel() {
  const [status, setStatus] = useState("Initializing");
  const [devices, setDevices] = useState({ inputs: [], outputs: [] });
  const [events, setEvents] = useState([]);
  const [activeNotes, setActiveNotes] = useState([]);

  useEffect(() => {
    midiRuntime.init().then((ok) => {
      setStatus(ok ? "MIDI Ready" : "Simulator Mode");
    });

    const offAny = runtimeBus.on("*", (event) => {
      if (event.type.startsWith("midi:")) {
        setEvents((old) => [event, ...old].slice(0, 12));
      }
    });

    const offDevices = runtimeBus.on("midi:devices", (event) => {
      setDevices(event.payload);
    });

    const offNoteOn = runtimeBus.on("midi:noteon", (event) => {
      setActiveNotes(event.payload.activeNotes || []);
    });

    const offNoteOff = runtimeBus.on("midi:noteoff", (event) => {
      setActiveNotes(event.payload.activeNotes || []);
    });

    return () => {
      offAny();
      offDevices();
      offNoteOn();
      offNoteOff();
    };
  }, []);

  return (
    <section className="panel">
      <h2>MIDI Runtime</h2>
      <p>Status: <strong>{status}</strong></p>

      <div className="grid">
        <div>
          <h3>Inputs</h3>
          {devices.inputs.length ? devices.inputs.map((d) => (
            <p key={d.id}>{d.name || "Unknown MIDI Input"}</p>
          )) : <p>No MIDI inputs detected</p>}
        </div>

        <div>
          <h3>Outputs</h3>
          {devices.outputs.length ? devices.outputs.map((d) => (
            <p key={d.id}>{d.name || "Unknown MIDI Output"}</p>
          )) : <p>No MIDI outputs detected</p>}
        </div>
      </div>

      <h3>Simulator Keyboard</h3>
      <div className="keys">
        {notes.map(([name, note]) => (
          <button key={note} onClick={() => midiRuntime.simulateNote(note)}>
            {name}
          </button>
        ))}
      </div>

      <p>Active Notes: {activeNotes.length ? activeNotes.join(", ") : "None"}</p>

      <h3>Recent MIDI Events</h3>
      <pre>{events.map((e) => `${e.type} ${JSON.stringify(e.payload)}`).join("\n")}</pre>
    </section>
  );
}
