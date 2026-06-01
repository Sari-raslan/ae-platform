import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

function App() {
  const [running, setRunning] = useState(false);
  const [bar, setBar] = useState(1);
  const [beat, setBeat] = useState(1);
  const [tick, setTick] = useState(0);
  const [style, setStyle] = useState("POP");
  const [variation, setVariation] = useState("VAR1");
  const [chord, setChord] = useState("C Major");
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (!running) return;

    const timer = setInterval(() => {
      setTick((current) => {
        const next = current + 1;

        if (next % 4 === 0) {
          setBeat((b) => {
            if (b >= 4) {
              setBar((x) => x + 1);
              return 1;
            }

            return b + 1;
          });
        }

        return next;
      });
    }, 180);

    return () => clearInterval(timer);
  }, [running]);

  function log(type) {
    setEvents((current) => [
      {
        type,
        bar,
        beat,
        tick,
        style,
        variation,
        chord,
        at: new Date().toISOString()
      },
      ...current
    ].slice(0, 20));
  }

  function start() {
    setRunning(true);
    log("START");
  }

  function stop() {
    setRunning(false);
    log("STOP");
  }

  function action(type, callback) {
    callback();
    log(type);
  }

  return (
    <main className="app">
      <header className="hero">
        <h1>Universal Arranger OS</h1>
        <p>Desktop Runtime Active</p>
      </header>

      <section className="controls">
        <button onClick={start}>START</button>
        <button onClick={stop}>STOP</button>
        <button onClick={() => action("POP", () => setStyle("POP"))}>POP</button>
        <button onClick={() => action("DANCE", () => setStyle("DANCE"))}>DANCE</button>
        <button onClick={() => action("BALLAD", () => setStyle("BALLAD"))}>BALLAD</button>
        <button onClick={() => action("VAR1", () => setVariation("VAR1"))}>VAR1</button>
        <button onClick={() => action("VAR2", () => setVariation("VAR2"))}>VAR2</button>
        <button onClick={() => action("C Major", () => setChord("C Major"))}>C MAJOR</button>
        <button onClick={() => action("A Minor", () => setChord("A Minor"))}>A MINOR</button>
        <button onClick={() => log("FILL")}>FILL</button>
        <button onClick={() => log("PAD")}>PAD</button>
        <button onClick={() => log("SAVE REG")}>SAVE REG</button>
      </section>

      <section className="grid">
        <div className="card">
          <span>STATUS</span>
          <strong>{running ? "RUNNING" : "STOPPED"}</strong>
        </div>

        <div className="card">
          <span>BAR</span>
          <strong>{bar}</strong>
        </div>

        <div className="card">
          <span>BEAT</span>
          <strong>{beat}</strong>
        </div>

        <div className="card">
          <span>STYLE</span>
          <strong>{style}</strong>
        </div>

        <div className="card">
          <span>VARIATION</span>
          <strong>{variation}</strong>
        </div>

        <div className="card">
          <span>CHORD</span>
          <strong>{chord}</strong>
        </div>
      </section>

      <section className="runtime">
        <h2>Runtime Events</h2>
        <pre>{JSON.stringify({ running, bar, beat, tick, style, variation, chord, events }, null, 2)}</pre>
      </section>
    </main>
  );
}

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
