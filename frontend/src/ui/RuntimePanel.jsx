import { useEffect, useState } from "react";
import { uaos } from "../audio/UAOSEngine";

const keys = [
  ["C",60],
  ["D",62],
  ["E",64],
  ["F",65],
  ["G",67],
  ["A",69],
  ["B",71],
  ["C2",72]
];

export default function RuntimePanel() {

  const [status, setStatus] = useState(uaos.status());
  const [events, setEvents] = useState([]);

  useEffect(() => {

    const off = uaos.on((event) => {

      setEvents(old => [event, ...old].slice(0, 30));

      setStatus(uaos.status());

    });

    const timer = setInterval(() => {
      setStatus(uaos.status());
    }, 500);

    return () => {
      off();
      clearInterval(timer);
    };

  }, []);

  async function startEngine() {
    await uaos.start();
    setStatus(uaos.status());
  }

  async function loadSamples(e) {

    const files = Array.from(e.target.files || []);

    for (const file of files) {
      await uaos.loadSample(file);
    }

    setStatus(uaos.status());
  }

  function saveProject() {

    const data = uaos.exportProject();

    const blob = new Blob(
      [JSON.stringify(data, null, 2)],
      { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "UniversalArrangerProject.uaosproject.json";

    a.click();

    URL.revokeObjectURL(url);
  }

  return (
    <section className="panel">

      <h2>FINAL PROFESSIONAL WORKSTATION</h2>

      <div className="toolbar">

        <button onClick={startEngine}>
          Start Engine
        </button>

        <button onClick={() => uaos.startArranger()}>
          Start Arranger
        </button>

        <button onClick={() => uaos.stopArranger()}>
          Stop Arranger
        </button>

        <button onClick={() => uaos.startRecord()}>
          Record
        </button>

        <button onClick={() => uaos.stopRecord()}>
          Stop Record
        </button>

        <button onClick={() => uaos.panic()}>
          Panic
        </button>

        <button onClick={saveProject}>
          Save Project
        </button>

        <label className="fileButton">
          Load Samples
          <input
            type="file"
            accept="audio/*"
            multiple
            hidden
            onChange={loadSamples}
          />
        </label>

      </div>

      <div className="grid">

        <div className="box">

          <h3>Audio Engine</h3>

          <p>State: {status.audio}</p>
          <p>Sample Rate: {status.sampleRate}</p>
          <p>Voices: {status.voices}</p>
          <p>Tempo: {status.tempo}</p>
          <p>Position: {status.position}</p>

          <label>Tempo</label>

          <input
            type="range"
            min="60"
            max="180"
            value={status.tempo}
            onChange={(e) => {
              uaos.setTempo(e.target.value);
              setStatus(uaos.status());
            }}
          />

          <label>Volume</label>

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            defaultValue="0.5"
            onChange={(e) => uaos.setVolume(e.target.value)}
          />

          <label>Filter</label>

          <input
            type="range"
            min="200"
            max="12000"
            step="10"
            defaultValue="9000"
            onChange={(e) => uaos.setFilter(e.target.value)}
          />

        </div>

        <div className="box">

          <h3>Samples</h3>

          <p>Loaded: {status.samples.length}</p>

          {status.samples.map(sample => (

            <div key={sample.id} className="track">

              <strong>{sample.name}</strong>

              <p>
                {sample.duration.toFixed(2)}s
              </p>

              <div className="toolbar">

                <button onClick={() => uaos.playSample(sample.id, 1)}>
                  Play
                </button>

                <button onClick={() => uaos.playSample(sample.id, 0.75)}>
                  Down
                </button>

                <button onClick={() => uaos.playSample(sample.id, 1.25)}>
                  Up
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

      <div className="box">

        <h3>Keyboard</h3>

        <div className="keys">

          {keys.map(([name, note]) => (

            <button
              key={note}
              onClick={() => {
                uaos.noteOn(note, 100);

                setTimeout(() => {
                  uaos.noteOff(note);
                }, 300);
              }}
            >
              {name}
            </button>

          ))}

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
