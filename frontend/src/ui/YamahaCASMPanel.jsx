import { useState } from "react";
import { yamahaCASMParser } from "../yamaha/YamahaCASMParser";

export default function YamahaCASMPanel() {
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState("No Yamaha style loaded");

  async function loadFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setMessage("Parsing Yamaha CASM...");
    const parsed = await yamahaCASMParser.parseFile(file);
    setResult(parsed);
    setMessage("CASM parse completed");
  }

  function exportJSON() {
    const data = yamahaCASMParser.exportNormalized();
    if (!data) return;

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json"
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "uaos-yamaha-casm-normalized.json";
    a.click();

    URL.revokeObjectURL(url);
  }

  return (
    <section className="panel">
      <h2>Yamaha CASM Parser</h2>

      <div className="toolbar">
        <label className="fileButton">
          Load Yamaha Style
          <input
            type="file"
            accept=".sty,.prs,.sst,.mid,.midi,*/*"
            hidden
            onChange={loadFile}
          />
        </label>

        <button onClick={exportJSON}>Export Normalized JSON</button>
      </div>

      <div className="box">
        <h3>Status</h3>
        <p>{message}</p>
      </div>

      {result && (
        <>
          <div className="grid">
            <div className="box">
              <h3>File</h3>
              <p>Name: {result.fileName}</p>
              <p>Size: {result.size} bytes</p>
              <p>Format: {result.format}</p>
            </div>

            <div className="box">
              <h3>CASM / MIDI</h3>
              <p>CASM Found: {String(result.casmFound)}</p>
              <p>CASM Offset: {result.casmOffset}</p>
              <p>MIDI Header: {String(result.midiHeaderFound)}</p>
              <p>MTrk Count: {result.midiTrackCount}</p>
            </div>

            <div className="box">
              <h3>Sections</h3>
              {result.sections.length === 0 && <p>No sections detected</p>}
              {result.sections.map((s) => <p key={s.name}> {s.name}</p>)}
            </div>

            <div className="box">
              <h3>Tracks</h3>
              {result.tracks.length === 0 && <p>No tracks detected</p>}
              {result.tracks.map((t) => <p key={t.name}> {t.name}  {t.role}</p>)}
            </div>
          </div>

          <div className="box">
            <h3>Raw Result</h3>
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </div>
        </>
      )}
    </section>
  );
}
