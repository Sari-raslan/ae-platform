import { useState } from "react";
import { midiFileParser } from "../midi/MidiFileParser";

export default function MidiFileParserPanel() {
  const [status, setStatus] = useState(midiFileParser.status?.() || null);
  const [message, setMessage] = useState("No MIDI file loaded");

  async function loadFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setMessage("Parsing MIDI / Style file...");

    const parsed = await midiFileParser.parse(file);

    setStatus(parsed);
    setMessage("Parsed successfully");
  }

  function exportEvents() {
    const data = midiFileParser.status();

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json"
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "uaos-midi-events.json";
    a.click();

    URL.revokeObjectURL(url);
  }

  return (
    <section className="panel">
      <h2>MIDI File Event Parser Foundation</h2>

      <div className="toolbar">
        <label className="fileButton">
          Load MIDI / Style File
          <input
            type="file"
            accept=".mid,.midi,.sty,.prs,.sst,*/*"
            hidden
            onChange={loadFile}
          />
        </label>

        <button onClick={exportEvents}>
          Export Parsed Events
        </button>
      </div>

      <div className="box">
        <h3>Status</h3>
        <p>{message}</p>
      </div>

      {status && status.file && (
        <>
          <div className="grid">
            <div className="box">
              <h3>File</h3>
              <p>Name: {status.file.name}</p>
              <p>Size: {status.file.size} bytes</p>
            </div>

            <div className="box">
              <h3>Header</h3>
              <p>Found: {String(status.header.found)}</p>
              <p>Format: {status.header.format}</p>
              <p>Tracks: {status.header.tracks}</p>
              <p>Division: {status.header.division}</p>
            </div>

            <div className="box">
              <h3>Events</h3>
              <p>Total: {status.totalEvents}</p>
              <p>Playable: {status.playableEvents}</p>
            </div>
          </div>

          <div className="box">
            <h3>Parsed Events Preview</h3>
            <pre>{JSON.stringify(status.events, null, 2)}</pre>
          </div>
        </>
      )}
    </section>
  );
}
