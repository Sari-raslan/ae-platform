import { useEffect, useState } from "react";
import { runtimeBus } from "../runtime/runtimeBus";
import { audioRuntime } from "../audio/audioRuntime";
import { styleEngine } from "../arranger/styleEngine";
import { midiRuntime } from "../midi/midiRuntime";

const chords = ["C", "Dm", "Em", "F", "G", "Am", "B"];
const sections = ["INTRO1", "VAR1", "VAR2", "FILL1", "ENDING1"];

export default function StyleEnginePanel() {
  const [events, setEvents] = useState([]);
  const [status, setStatus] = useState(styleEngine.getStatus());
  const [audio, setAudio] = useState(audioRuntime.getStatus());
  const [styles] = useState(styleEngine.listStyles());

  useEffect(() => {
    midiRuntime.init();

    const off = runtimeBus.on("*", (event) => {
      setEvents((old) => [event, ...old].slice(0, 20));
      setStatus(styleEngine.getStatus());
      setAudio(audioRuntime.getStatus());
    });

    return () => off();
  }, []);

  async function startAudio() {
    await audioRuntime.start();
    setAudio(audioRuntime.getStatus());
  }

  return (
    <section className="panel">
      <h2>Arranger Style Engine</h2>

      <div className="toolbar">
        <button onClick={startAudio}>Start Audio</button>
        <button onClick={() => styleEngine.start()}>Start Style</button>
        <button onClick={() => styleEngine.stop()}>Stop Style</button>
        <button onClick={() => audioRuntime.panic()}>Panic</button>
      </div>

      <div className="grid">
        <div className="box">
          <h3>Style</h3>
          <select
            value={status.styleId}
            onChange={(e) => styleEngine.loadStyle(e.target.value)}
          >
            {styles.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          <p>Current: {status.style}</p>
          <p>Running: {String(status.running)}</p>
          <p>Step: {status.step}</p>
        </div>

        <div className="box">
          <h3>Sections</h3>
          <div className="keys">
            {sections.map((s) => (
              <button key={s} onClick={() => styleEngine.setSection(s)}>
                {s}
              </button>
            ))}
          </div>
          <p>Current Section: {status.section}</p>
        </div>

        <div className="box">
          <h3>Chord Control</h3>
          <div className="keys">
            {chords.map((c) => (
              <button key={c} onClick={() => styleEngine.setChord(c)}>
                {c}
              </button>
            ))}
          </div>
          <p>Current Chord: {status.chord}</p>
        </div>

        <div className="box">
          <h3>Tempo / Audio</h3>
          <input
            type="number"
            value={status.tempo}
            onChange={(e) => styleEngine.setTempo(e.target.value)}
          />
          <p>Audio State: {audio.state}</p>
          <p>Active Voices: {audio.activeVoices}</p>
          <p>Sample Rate: {audio.sampleRate}</p>
        </div>
      </div>

      <h3>Runtime Events</h3>
      <pre>{events.map((e) => `${e.type} ${JSON.stringify(e.payload)}`).join("\n")}</pre>
    </section>
  );
}
