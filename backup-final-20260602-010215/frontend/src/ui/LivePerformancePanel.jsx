import { useEffect, useState } from "react";
import { livePerformance } from "../performance/LivePerformanceEngine";

const sections = ["INTRO", "MAIN_A", "MAIN_B", "FILL", "BREAK", "ENDING"];
const chords = ["C", "Dm", "Em", "F", "G", "Am", "B"];

export default function LivePerformancePanel() {
  const [status, setStatus] = useState(livePerformance.status());
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const off = livePerformance.on((event) => {
      setEvents((old) => [event, ...old].slice(0, 30));
      setStatus(livePerformance.status());
    });

    const timer = setInterval(() => {
      setStatus(livePerformance.status());
    }, 500);

    return () => {
      off();
      clearInterval(timer);
    };
  }, []);

  function saveSetlist() {
    const data = livePerformance.exportSetlist();

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json"
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "UniversalArrangerSetlist.uaossetlist.json";
    a.click();

    URL.revokeObjectURL(url);
  }

  async function loadSetlist(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    livePerformance.importSetlist(JSON.parse(text));
    setStatus(livePerformance.status());
  }

  return (
    <section className="panel">
      <h2>Live Performance Mode</h2>

      <div className="toolbar">
        <button onClick={() => livePerformance.start()}>Start</button>
        <button onClick={() => livePerformance.stop()}>Stop</button>
        <button onClick={() => livePerformance.panic()}>Panic</button>
        <button onClick={() => livePerformance.previousScene()}>Previous Scene</button>
        <button onClick={() => livePerformance.nextScene()}>Next Scene</button>
        <button onClick={() => livePerformance.addScene("Custom Scene")}>Add Scene</button>
        <button onClick={saveSetlist}>Save Setlist</button>

        <label className="fileButton">
          Load Setlist
          <input type="file" accept=".json,.uaossetlist" hidden onChange={loadSetlist} />
        </label>
      </div>

      <div className="grid">
        <div className="box bigStage">
          <h3>Current Scene</h3>
          <h1>{status.currentScene?.name}</h1>
          <p>Style: {status.currentScene?.style}</p>
          <p>Section: {status.currentScene?.section}</p>
          <p>Chord: {status.currentScene?.chord}</p>
          <p>Tempo: {status.currentScene?.tempo}</p>
          <p>Running: {String(status.running)}</p>
          <p>Step: {status.step}</p>
        </div>

        <div className="box">
          <h3>Tempo</h3>
          <input
            type="number"
            value={status.currentScene?.tempo || 110}
            onChange={(e) => livePerformance.setTempo(e.target.value)}
          />

          <h3>Sections</h3>
          <div className="keys">
            {sections.map((s) => (
              <button key={s} onClick={() => livePerformance.setSection(s)}>
                {s}
              </button>
            ))}
          </div>

          <h3>Chords</h3>
          <div className="keys">
            {chords.map((c) => (
              <button key={c} onClick={() => livePerformance.setChord(c)}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="box">
        <h3>Scene Buttons</h3>

        <div className="sceneGrid">
          {status.scenes.map((scene) => (
            <button
              key={scene.id}
              className={scene.id === status.currentScene?.id ? "activeScene" : ""}
              onClick={() => livePerformance.setScene(scene.id)}
            >
              {scene.name}
            </button>
          ))}
        </div>
      </div>

      <div className="box">
        <h3>Setlist</h3>

        {status.scenes.map((scene) => (
          <div key={scene.id} className="track">
            <strong>{scene.name}</strong>
            <p>{scene.style} | {scene.section} | {scene.chord} | {scene.tempo} BPM</p>

            <button onClick={() => livePerformance.removeScene(scene.id)}>
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="box">
        <h3>Runtime Events</h3>
        <pre>
          {events.map((e) => `${e.type} ${JSON.stringify(e.data)}`).join("\n")}
        </pre>
      </div>
    </section>
  );
}
