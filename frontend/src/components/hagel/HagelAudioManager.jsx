import { useState } from "react";

export default function HagelAudioManager() {
  const [result, setResult] = useState(null);
  const [grid, setGrid] = useState("1/16");

  async function uploadFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const form = new FormData();
    form.append("file", file);

    const res = await fetch("http://localhost:4000/api/hagel/analyze", {
      method: "POST",
      body: form
    });

    setResult(await res.json());
  }

  async function quantizeMidi() {
    const res = await fetch("http://localhost:4000/api/hagel/midi/quantize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ grid, strength: 100 })
    });
    setResult(await res.json());
  }

  async function cleanupAudio() {
    const res = await fetch("http://localhost:4000/api/hagel/audio/cleanup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ noiseReduction: true, normalize: true })
    });
    setResult(await res.json());
  }

  return (
    <section className="hagel-panel">
      <h2>Hagel Audio Manager</h2>
      <p>Repair assistant for messy live MIDI, audio recordings, SysEx dumps, quantization, noise cleanup, and performance correction.</p>

      <div className="hagel-actions">
        <label className="hagel-upload">
          Upload Audio / MIDI / SysEx
          <input type="file" onChange={uploadFile} accept=".mid,.midi,.wav,.mp3,.flac,.aiff,.ogg,.m4a,.syx,*/*" />
        </label>

        <select value={grid} onChange={e => setGrid(e.target.value)}>
          <option value="1/4">1/4</option>
          <option value="1/8">1/8</option>
          <option value="1/16">1/16</option>
          <option value="1/32">1/32</option>
        </select>

        <button onClick={quantizeMidi}>Quantize MIDI</button>
        <button onClick={cleanupAudio}>Clean Audio</button>
      </div>

      {result && <pre className="hagel-result">{JSON.stringify(result, null, 2)}</pre>}
    </section>
  );
}
