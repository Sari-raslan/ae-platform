import { useEffect, useState } from "react";
import { arrangerCore } from "../arranger/ArrangerCore";
import { midiArrangerInput } from "../midi/MidiArrangerInput";
import { chordDetector } from "../midi/ChordDetector";

const sections = ["INTRO", "MAIN_A", "MAIN_B", "FILL", "ENDING"];
const chords = ["C", "Dm", "Em", "F", "G", "Am", "B", "C7", "G7", "Am7", "Csus4"];

export default function MidiArrangerPanel() {
  const [status, setStatus] = useState(arrangerCore.status());
  const [detector, setDetector] = useState(chordDetector.status());
  const [devices, setDevices] = useState({ inputs: [], outputs: [] });
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const offArr = arrangerCore.on((e) => {
      setEvents((old) => [e, ...old].slice(0, 30));
      setStatus(arrangerCore.status());
    });

    const offMidi = midiArrangerInput.on((e) => {
      setEvents((old) => [e, ...old].slice(0, 30));
      setDetector(chordDetector.status());

      if (e.type === "midi:devices") {
        setDevices(e.data);
      }
    });

    const timer = setInterval(() => {
      setStatus(arrangerCore.status());
      setDetector(chordDetector.status());
    }, 400);

    return () => {
      offArr();
      offMidi();
      clearInterval(timer);
    };
  }, []);

  async function startMidi() {
    await midiArrangerInput.start();
    setStatus(arrangerCore.status());
  }

  return (
    <section className="panel">
      <h2>MIDI Chord Detection + Arranger Control</h2>

      <div className="toolbar">
        <button onClick={startMidi}>Start MIDI</button>
        <button onClick={() => arrangerCore.start()}>Start Arranger</button>
        <button onClick={() => arrangerCore.stop()}>Stop Arranger</button>
      </div>

      <div className="grid">
        <div className="box">
          <h3>Arranger</h3>
          <p>Running: {String(status.running)}</p>
          <p>Tempo: {status.tempo}</p>
          <p>Section: {status.section}</p>
          <p>Chord: {status.chord}</p>
          <p>Step: {status.step}</p>

          <label>Tempo</label>
          <input
            type="range"
            min="70"
            max="180"
            value={status.tempo}
            onChange={(e) => {
              arrangerCore.setTempo(e.target.value);
              setStatus(arrangerCore.status());
            }}
          />
        </div>

        <div className="box">
          <h3>MIDI Chord Detector</h3>
          <p>Detected Chord: {detector.chord || "None"}</p>
          <p>Active Notes: {detector.activeNotes.join(", ") || "None"}</p>

          <h3>MIDI Inputs</h3>
          {devices.inputs.length === 0 && <p>No MIDI inputs detected</p>}
          {devices.inputs.map((d, i) => (
            <p key={i}>{d}</p>
          ))}
        </div>
      </div>

      <div className="box">
        <h3>Sections</h3>
        <div className="keys">
          {sections.map((section) => (
            <button key={section} onClick={() => arrangerCore.setSection(section)}>
              {section}
            </button>
          ))}
        </div>
      </div>

      <div className="box">
        <h3>Manual Chords</h3>
        <div className="keys">
          {chords.map((chord) => (
            <button key={chord} onClick={() => arrangerCore.setChord(chord)}>
              {chord}
            </button>
          ))}
        </div>
      </div>

      <div className="box">
        <h3>Runtime Events</h3>
        <pre>{events.map((e) => `${e.type} ${JSON.stringify(e.data)}`).join("\n")}</pre>
      </div>
    </section>
  );
}
