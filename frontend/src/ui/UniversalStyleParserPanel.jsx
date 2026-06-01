import { useState } from "react";
import { universalStyleParser } from "../styles/UniversalStyleParser";

export default function UniversalStyleParserPanel() {
  const [style, setStyle] = useState(null);
  const [message, setMessage] = useState("No style loaded");

  async function loadStyle(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setMessage("Parsing style file...");

    try {
      const parsed = await universalStyleParser.parseFile(file);
      setStyle(parsed);
      setMessage("Style parsed successfully");
    } catch (error) {
      setMessage("Parse failed: " + error.message);
    }
  }

  function saveNormalized() {
    const data = universalStyleParser.exportNormalizedStyle();
    if (!data) return;

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json"
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "normalized-style.uaosstyle.json";
    a.click();

    URL.revokeObjectURL(url);
  }

  return (
    <section className="panel">
      <h2>Yamaha + KORG Style Parser Foundation</h2>

      <div className="toolbar">
        <label className="fileButton">
          Load Style File
          <input
            type="file"
            accept=".sty,.prs,.sst,.stl,.mid,.midi,*/*"
            hidden
            onChange={loadStyle}
          />
        </label>

        <button onClick={saveNormalized}>
          Export Normalized Style
        </button>
      </div>

      <div className="box">
        <h3>Status</h3>
        <p>{message}</p>
      </div>

      {style && (
        <>
          <div className="grid">
            <div className="box">
              <h3>Style Info</h3>
              <p>Name: {style.name}</p>
              <p>Format: {style.format}</p>
              <p>Size: {style.size} bytes</p>
              <p>Parsed: {style.parsedAt}</p>
            </div>

            <div className="box">
              <h3>Metadata</h3>
              <p>MIDI Header: {String(style.metadata.hasMidiHeader)}</p>
              <p>MIDI Tracks: {String(style.metadata.hasMidiTracks)}</p>
              <p>CASM: {String(style.metadata.hasCASM)}</p>
              <p>SFF1: {String(style.metadata.hasSFF1)}</p>
              <p>SFF2: {String(style.metadata.hasSFF2)}</p>
              <p>KORG Marker: {String(style.metadata.hasKorgMarker)}</p>
            </div>

            <div className="box">
              <h3>Detected Chunks</h3>
              {style.chunks.length === 0 && <p>No known chunks detected</p>}
              {style.chunks.map((chunk) => (
                <p key={chunk.name}> {chunk.name}</p>
              ))}
            </div>

            <div className="box">
              <h3>Track Map</h3>
              <pre>{JSON.stringify(style.tracks, null, 2)}</pre>
            </div>
          </div>

          <div className="box">
            <h3>Sections</h3>
            <div className="grid">
              {Object.values(style.sections).map((section) => (
                <div key={section.name} className="box">
                  <h4>{section.name}</h4>
                  <p>Detected: {String(section.detected)}</p>
                  <p>Bars: {section.bars}</p>
                  <pre>{JSON.stringify(section.tracks, null, 2)}</pre>
                </div>
              ))}
            </div>
          </div>

          <div className="box">
            <h3>Raw Parsed JSON</h3>
            <pre>{JSON.stringify(style, null, 2)}</pre>
          </div>
        </>
      )}
    </section>
  );
}
