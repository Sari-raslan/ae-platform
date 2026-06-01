import { useEffect, useState } from "react";
import { advancedArranger } from "../arranger/AdvancedArrangerEngine";

const chords = ["C", "Dm", "Em", "F", "G", "Am", "B", "D", "E", "A"];

export default function AdvancedArrangerPanel() {
  const [status, setStatus] = useState(advancedArranger.status());
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const off = advancedArranger.on((event) => {
      setEvents((old) => [event, ...old].slice(0, 35));
      setStatus(advancedArranger.status());
    });

    const timer = setInterval(() => {
      setStatus(advancedArranger.status());
    }, 400);

    return () => {
      off();
      clearInterval(timer);
    };
  }, []);

  return (
    <section className="panel">
      <h2>Advanced Style Transitions</h2>

      <div className="toolbar">
        <button onClick={() => advancedArranger.intro()}>INTRO</button>
        <button onClick={() => advancedArranger.start()}>START</button>
        <button onClick={() => advancedArranger.stop()}>STOP</button>
        <button onClick={() => advancedArranger.mainA()}>MAIN A</button>
        <button onClick={() => advancedArranger.mainB()}>MAIN B</button>
        <button onClick={() => advancedArranger.fillA()}>FILL A</button>
        <button onClick={() => advancedArranger.fillB()}>FILL B</button>
        <button onClick={() => advancedArranger.break()}>BREAK</button>
        <button onClick={() => advancedArranger.ending()}>ENDING</button>
      </div>

      <div className="grid">
        <div className="box">
          <h3>Status</h3>
          <p>Running: {String(status.running)}</p>
          <p>Tempo: {status.tempo}</p>
          <p>Chord: {status.chord}</p>
          <p>Section: {status.section}</p>
          <p>Queued: {status.nextSection || "None"}</p>
          <p>Step: {status.step}</p>
          <p>Bar: {status.bar}</p>

          <label>Tempo</label>
          <input
            type="range"
            min="70"
            max="180"
            value={status.tempo}
            onChange={(e) => {
              advancedArranger.setTempo(e.target.value);
              setStatus(advancedArranger.status());
            }}
          />
        </div>

        <div className="box">
          <h3>Chord Control</h3>
          <div className="keys">
            {chords.map((chord) => (
              <button key={chord} onClick={() => advancedArranger.setChord(chord)}>
                {chord}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="box">
        <h3>Runtime Events</h3>
        <pre>{events.map((e) => `${e.type} ${JSON.stringify(e.data)}`).join("\n")}</pre>
      </div>
    </section>
  );
}
