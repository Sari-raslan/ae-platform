import { useEffect, useState } from "react";
import { arrangerEngine } from "../arranger/RealArrangerEngine";

const chords = ["C","Dm","Em","F","G","Am","B"];
const sections = ["INTRO","MAIN_A","MAIN_B","FILL","ENDING"];

export default function ArrangerPanel() {

  const [status, setStatus] = useState(arrangerEngine.status());
  const [events, setEvents] = useState([]);

  useEffect(() => {

    const off = arrangerEngine.on((e) => {

      setEvents(old => [e,...old].slice(0,25));

      setStatus(arrangerEngine.status());

    });

    const timer = setInterval(() => {
      setStatus(arrangerEngine.status());
    }, 400);

    return () => {
      off();
      clearInterval(timer);
    };

  }, []);

  return (
    <section className="panel">

      <h2>Real Arranger Playback Engine</h2>

      <div className="toolbar">

        <button onClick={() => arrangerEngine.start()}>
          Start
        </button>

        <button onClick={() => arrangerEngine.stop()}>
          Stop
        </button>

      </div>

      <div className="grid">

        <div className="box">

          <h3>Status</h3>

          <p>Running: {String(status.running)}</p>
          <p>Tempo: {status.tempo}</p>
          <p>Chord: {status.chord}</p>
          <p>Section: {status.section}</p>
          <p>Step: {status.step}</p>
          <p>Style: {status.style}</p>

          <label>Tempo</label>

          <input
            type="range"
            min="70"
            max="180"
            value={status.tempo}
            onChange={(e) => {
              arrangerEngine.setTempo(e.target.value);
              setStatus(arrangerEngine.status());
            }}
          />

        </div>

        <div className="box">

          <h3>Sections</h3>

          <div className="keys">

            {sections.map(sec => (

              <button
                key={sec}
                onClick={() => arrangerEngine.setSection(sec)}
              >
                {sec}
              </button>

            ))}

          </div>

          <h3>Chords</h3>

          <div className="keys">

            {chords.map(ch => (

              <button
                key={ch}
                onClick={() => arrangerEngine.setChord(ch)}
              >
                {ch}
              </button>

            ))}

          </div>

        </div>

      </div>

      <div className="box">

        <h3>Runtime Events</h3>

        <pre>
{events.map(e =>
`${e.type} ${JSON.stringify(e.data)}`
).join("\n")}
        </pre>

      </div>

    </section>
  );
}
