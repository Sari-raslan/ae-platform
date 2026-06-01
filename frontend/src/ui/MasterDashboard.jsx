import { useEffect, useState } from "react";
import { masterEngine } from "../core/MasterEngine";

const chords = ["C", "Dm", "Em", "F", "G", "Am", "B"];
const sections = ["INTRO", "MAIN_A", "MAIN_B", "FILL", "ENDING"];
const keys = [["C",60],["D",62],["E",64],["F",65],["G",67],["A",69],["B",71],["C2",72]];

export default function MasterDashboard() {
  const [status, setStatus] = useState(masterEngine.status());

  useEffect(() => {
    const off = masterEngine.on(() => setStatus(masterEngine.status()));
    const timer = setInterval(() => setStatus(masterEngine.status()), 500);
    return () => { off(); clearInterval(timer); };
  }, []);

  async function startAudio() {
    await masterEngine.startAudio();
    setStatus(masterEngine.status());
  }

  async function loadSamples(e) {
    const files = Array.from(e.target.files || []);
    for (const file of files) await masterEngine.loadSample(file);
    setStatus(masterEngine.status());
  }

  function saveProject() {
    const blob = new Blob([JSON.stringify(masterEngine.exportProject(), null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "uaos-master-project.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function testNote(note) {
    masterEngine.noteOn(note, 100);
    setTimeout(() => masterEngine.noteOff(note), 350);
  }

  return (
    <section className="panel">
      <h2>UAOS Master Arranger Workstation</h2>

      <div className="toolbar">
        <button onClick={startAudio}>Start Audio</button>
        <button onClick={() => masterEngine.startArranger()}>Start Arranger</button>
        <button onClick={() => masterEngine.stopArranger()}>Stop Arranger</button>
        <button onClick={() => masterEngine.startRecord()}>Record</button>
        <button onClick={() => masterEngine.stopRecord()}>Stop Record</button>
        <button onClick={() => masterEngine.panic()}>Panic</button>
        <button onClick={saveProject}>Save Project</button>

        <label className="fileButton">
          Load Samples
          <input type="file" accept="audio/*" multiple hidden onChange={loadSamples} />
        </label>
      </div>

      <div className="grid">
        <div className="box">
          <h3>Engine</h3>
          <p>Audio: {status.audio}</p>
          <p>Sample Rate: {status.sampleRate}</p>
          <p>Running: {String(status.running)}</p>
          <p>Recording: {String(status.recording)}</p>
          <p>Voices: {status.voices}</p>
          <p>Step: {status.step}</p>

          <label>Tempo {status.tempo}</label>
          <input type="range" min="60" max="180" value={status.tempo} onChange={(e) => masterEngine.setTempo(e.target.value)} />

          <label>Volume</label>
          <input type="range" min="0" max="1" step="0.01" defaultValue="0.45" onChange={(e) => masterEngine.setVolume(e.target.value)} />

          <label>Filter</label>
          <input type="range" min="200" max="12000" defaultValue="9000" onChange={(e) => masterEngine.setFilter(e.target.value)} />
        </div>

        <div className="box">
          <h3>Arranger</h3>
          <p>Section: {status.section}</p>
          <p>Chord: {status.chord}</p>

          <h4>Sections</h4>
          <div className="keys">
            {sections.map(s => <button key={s} onClick={() => masterEngine.setSection(s)}>{s}</button>)}
          </div>

          <h4>Chords</h4>
          <div className="keys">
            {chords.map(c => <button key={c} onClick={() => masterEngine.setChord(c)}>{c}</button>)}
          </div>
        </div>

        <div className="box">
          <h3>Keyboard</h3>
          <div className="keys">
            {keys.map(([name,note]) => <button key={note} onClick={() => testNote(note)}>{name}</button>)}
          </div>
        </div>

        <div className="box">
          <h3>Samples</h3>
          <p>Loaded: {status.samples.length}</p>
          {status.samples.map(s => (
            <div key={s.id} className="track">
              <strong>{s.name}</strong>
              <p>{s.duration.toFixed(2)}s</p>
              <div className="toolbar">
                <button onClick={() => masterEngine.playSample(s.id, 1)}>Play</button>
                <button onClick={() => masterEngine.playSample(s.id, 0.75)}>Down</button>
                <button onClick={() => masterEngine.playSample(s.id, 1.25)}>Up</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="box">
        <h3>Events</h3>
        <pre>{status.events.map(e => `${e.type} ${JSON.stringify(e.data)}`).join("\n")}</pre>
      </div>
    </section>
  );
}
