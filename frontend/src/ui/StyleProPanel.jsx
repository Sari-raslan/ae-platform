import { useState } from "react";
import { styleProEngine } from "../stylepro/StyleProEngine";

export default function StyleProPanel() {
  const [status, setStatus] = useState(styleProEngine.status());
  const [sampleName, setSampleName] = useState("");
  const [category, setCategory] = useState("User");
  const [rootNote, setRootNote] = useState(60);

  async function loadStyle(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    await styleProEngine.parseStyleFile(file);
    setStatus(styleProEngine.status());
  }

  function addRoute() {
    styleProEngine.addMidiRoute("All Inputs", 1, "Arranger");
    setStatus(styleProEngine.status());
  }

  function addSample() {
    if (!sampleName.trim()) return;

    styleProEngine.addSampleToLibrary(sampleName, category, rootNote);
    setSampleName("");
    setStatus(styleProEngine.status());
  }

  function exportJSON() {
    const blob = new Blob(
      [JSON.stringify(styleProEngine.exportProjectData(), null, 2)],
      { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "uaos-style-routing-library.json";
    a.click();

    URL.revokeObjectURL(url);
  }

  return (
    <section className="panel">
      <h2>Style Parser + MIDI Routing + Sample Library</h2>

      <div className="toolbar">
        <label className="fileButton">
          Load Yamaha / KORG Style
          <input
            type="file"
            accept=".sty,.prs,.sst,.stl,.mid,.midi,*/*"
            hidden
            onChange={loadStyle}
          />
        </label>

        <button onClick={addRoute}>Add MIDI Route</button>
        <button onClick={exportJSON}>Export Project Data</button>
      </div>

      <div className="grid">
        <div className="box">
          <h3>Loaded Style</h3>

          {!status.loadedStyle && <p>No style loaded</p>}

          {status.loadedStyle && (
            <>
              <p>Name: {status.loadedStyle.name}</p>
              <p>Format: {status.loadedStyle.format}</p>
              <p>Size: {status.loadedStyle.size}</p>
              <p>MIDI Tracks: {status.loadedStyle.markers.tracks}</p>
              <p>CASM: {String(status.loadedStyle.markers.casm)}</p>
              <p>KORG: {String(status.loadedStyle.markers.korg)}</p>
            </>
          )}
        </div>

        <div className="box">
          <h3>Sections</h3>
          {status.loadedStyle?.sections?.length ? (
            status.loadedStyle.sections.map((s) => <p key={s.name}> {s.name}</p>)
          ) : (
            <p>No sections detected</p>
          )}
        </div>

        <div className="box">
          <h3>Tracks</h3>
          {status.loadedStyle?.tracks?.length ? (
            status.loadedStyle.tracks.map((t) => (
              <p key={t.name}> {t.name}  {t.role}</p>
            ))
          ) : (
            <p>No tracks detected</p>
          )}
        </div>

        <div className="box">
          <h3>MIDI Routes</h3>

          {status.midiRoutes.length === 0 && <p>No routes</p>}

          {status.midiRoutes.map((r) => (
            <div key={r.id} className="track">
              <p>{r.input} / Ch {r.channel}  {r.target}</p>
              <button onClick={() => {
                styleProEngine.removeMidiRoute(r.id);
                setStatus(styleProEngine.status());
              }}>
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="box">
        <h3>Sample Library Manager</h3>

        <input
          placeholder="Sample file name"
          value={sampleName}
          onChange={(e) => setSampleName(e.target.value)}
        />

        <input
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <input
          type="number"
          value={rootNote}
          onChange={(e) => setRootNote(e.target.value)}
        />

        <button onClick={addSample}>Add Sample Metadata</button>

        {status.sampleLibrary.map((s) => (
          <div key={s.id} className="track">
            <strong>{s.fileName}</strong>
            <p>{s.category} | Root: {s.rootNote}</p>
            <button onClick={() => {
              styleProEngine.removeSample(s.id);
              setStatus(styleProEngine.status());
            }}>
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="box">
        <h3>Raw State</h3>
        <pre>{JSON.stringify(status, null, 2)}</pre>
      </div>
    </section>
  );
}
