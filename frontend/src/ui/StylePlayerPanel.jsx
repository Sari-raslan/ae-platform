import { useEffect, useState } from "react";
import { stylePlayer } from "../arranger/StylePlayer";

const chords = ["C", "Dm", "Em", "F", "G", "Am", "B"];

export default function StylePlayerPanel() {
  const [status, setStatus] = useState(stylePlayer.status());
  const [events, setEvents] = useState([]);
  const [styles] = useState(stylePlayer.listStyles());

  useEffect(() => {
    const off = stylePlayer.on((event) => {
      setEvents((old) => [event, ...old].slice(0, 25));
      setStatus(stylePlayer.status());
    });

    const timer = setInterval(() => {
      setStatus(stylePlayer.status());
    }, 500);

    return () => {
      off();
      clearInterval(timer);
    };
  }, []);

  const currentStyle = styles.find((s) => s.id === status.styleId);
  const sections = currentStyle?.sections || [];

  return (
    <section className="panel">
      <h2>Yamaha / KORG Style Engine Foundation</h2>

      <div className="toolbar">
        <button onClick={() => stylePlayer.start()}>Start Style</button>
        <button onClick={() => stylePlayer.stop()}>Stop Style</button>
      </div>

      <div className="grid">
        <div className="box">
          <h3>Style</h3>
          <select
            value={status.styleId}
            onChange={(e) => stylePlayer.loadStyle(e.target.value)}
          >
            {styles.map((style) => (
              <option key={style.id} value={style.id}>
                {style.name}
              </option>
            ))}
          </select>

          <p>Format: {status.format}</p>
          <p>Running: {String(status.running)}</p>
          <p>Step: {status.step}</p>
        </div>

        <div className="box">
          <h3>Tempo</h3>
          <input
            type="number"
            value={status.tempo}
            onChange={(e) => stylePlayer.setTempo(e.target.value)}
          />
        </div>

        <div className="box">
          <h3>Sections</h3>
          <div className="keys">
            {sections.map((section) => (
              <button key={section} onClick={() => stylePlayer.setSection(section)}>
                {section}
              </button>
            ))}
          </div>
          <p>Current: {status.section}</p>
        </div>

        <div className="box">
          <h3>Chord Control</h3>
          <div className="keys">
            {chords.map((chord) => (
              <button key={chord} onClick={() => stylePlayer.setChord(chord)}>
                {chord}
              </button>
            ))}
          </div>
          <p>Current: {status.chord}</p>
        </div>
      </div>

      <div className="box">
        <h3>Runtime Events</h3>
        <pre>{events.map((e) => `${e.type} ${JSON.stringify(e.data)}`).join("\n")}</pre>
      </div>
    </section>
  );
}
