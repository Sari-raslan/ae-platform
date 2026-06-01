import { useState } from "react";
import { yamahaStyleParser } from "../styles/YamahaStyleParser";

export default function YamahaStyleParserPanel() {
  const [style, setStyle] = useState(null);
  const [message, setMessage] = useState("No Yamaha style loaded");

  async function loadStyle(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    setMessage("Parsing Yamaha style...");

    const parsed = await yamahaStyleParser.parseFile(file);

    setStyle(parsed);
    setMessage("Yamaha style parsed");
  }

  return (
    <section className="panel">
      <h2>Yamaha Style Parser Foundation</h2>

      <div className="toolbar">
        <label className="fileButton">
          Load Yamaha Style File
          <input
            type="file"
            accept=".sty,.prs,.sst,.mid,.midi,*/*"
            hidden
            onChange={loadStyle}
          />
        </label>
      </div>

      <div className="box">
        <h3>Status</h3>
        <p>{message}</p>
      </div>

      {style && (
        <div className="grid">
          <div className="box">
            <h3>Style Info</h3>
            <p>Name: {style.name}</p>
            <p>Format: {style.format}</p>
            <p>Size: {style.size} bytes</p>
            <p>Parsed: {style.parsedAt}</p>
          </div>

          <div className="box">
            <h3>Detected Chunks</h3>
            {style.detectedChunks.length === 0 && <p>No known chunks detected</p>}
            {style.detectedChunks.map((chunk) => (
              <p key={chunk.name}> {chunk.name}</p>
            ))}
          </div>

          <div className="box">
            <h3>Sections</h3>
            {Object.values(style.sections).map((section) => (
              <p key={section.name}>
                {section.name} {section.fallback ? "(fallback)" : ""}
              </p>
            ))}
          </div>

          <div className="box">
            <h3>Raw Parsed JSON</h3>
            <pre>{JSON.stringify(style, null, 2)}</pre>
          </div>
        </div>
      )}
    </section>
  );
}
