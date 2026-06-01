import { useEffect, useState } from "react";
import { runtimeBus } from "../runtime/runtimeBus";
import { audioRuntime } from "../audio/audioRuntime";
import { midiRuntime } from "../midi/midiRuntime";
import { styleEngine } from "../arranger/styleEngine";
import { sampleRuntime } from "../samples/sampleRuntime";

const keys = [["C",60],["D",62],["E",64],["F",65],["G",67],["A",69],["B",71],["C2",72]];
const chords = ["C","Dm","Em","F","G","Am","B"];
const sections = ["INTRO1","VAR1","VAR2","FILL1","ENDING1"];
const waveforms = ["sine","triangle","square","sawtooth"];

export default function WorkstationPanel() {
  const [events, setEvents] = useState([]);
  const [audio, setAudio] = useState(audioRuntime.getStatus());
  const [devices, setDevices] = useState({ inputs: [], outputs: [] });
  const [style, setStyle] = useState(styleEngine.getStatus());
  const [styles] = useState(styleEngine.listStyles());
  const [samples, setSamples] = useState(sampleRuntime.getSamples());

  useEffect(() => {
    midiRuntime.init();

    const off = runtimeBus.on("*", (event) => {
      setEvents((old) => [event, ...old].slice(0, 24));
      setAudio(audioRuntime.getStatus());
      setStyle(styleEngine.getStatus());

      if (event.type === "midi:devices") setDevices(event.payload);
      if (event.type.startsWith("sample:")) setSamples([...sampleRuntime.getSamples()]);
    });

    const id = setInterval(() => {
      setAudio(audioRuntime.getStatus());
      setStyle(styleEngine.getStatus());
    }, 1000);

    return () => {
      off();
      clearInterval(id);
    };
  }, []);

  async function startAudio() {
    await audioRuntime.start();
    setAudio(audioRuntime.getStatus());
  }

  return (
    <section className="panel">
      <h2>Universal Arranger Workstation Core</h2>

      <div className="toolbar">
        <button onClick={startAudio}>Start Audio</button>
        <button onClick={() => styleEngine.start()}>Start Style</button>
        <button onClick={() => styleEngine.stop()}>Stop Style</button>
        <button onClick={() => audioRuntime.panic()}>Panic</button>
        <button onClick={() => sampleRuntime.addSample("Sample Slot")}>Add Sample</button>
      </div>

      <div className="grid">
        <div className="box">
          <h3>Audio Engine</h3>
          <p>State: <strong>{audio.state}</strong></p>
          <p>Sample Rate: {audio.sampleRate}</p>
          <p>Active Voices: {audio.activeVoices}</p>
          <p>Waveform: {audio.waveform}</p>

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            defaultValue={audio.masterVolume}
            onChange={(e) => audioRuntime.setMasterVolume(e.target.value)}
          />

          <div className="keys">
            {waveforms.map((w) => (
              <button key={w} onClick={() => audioRuntime.setWaveform(w)}>{w}</button>
            ))}
          </div>
        </div>

        <div className="box">
          <h3>MIDI</h3>
          <p>Inputs: {devices.inputs.length}</p>
          <p>Outputs: {devices.outputs.length}</p>
          {devices.inputs.map((d) => <p key={d.id}>{d.name}</p>)}
        </div>

        <div className="box">
          <h3>Style Engine</h3>
          <select value={style.styleId} onChange={(e) => styleEngine.loadStyle(e.target.value)}>
            {styles.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <p>Style: {style.style}</p>
          <p>Section: {style.section}</p>
          <p>Chord: {style.chord}</p>
          <p>Running: {String(style.running)}</p>
          <input type="number" value={style.tempo} onChange={(e) => styleEngine.setTempo(e.target.value)} />
        </div>

        <div className="box">
          <h3>Samples</h3>
          <p>Slots: {samples.length}</p>
          {samples.map((s) => <p key={s.id}>{s.name}</p>)}
        </div>
      </div>

      <h3>Sections</h3>
      <div className="keys">
        {sections.map((s) => <button key={s} onClick={() => styleEngine.setSection(s)}>{s}</button>)}
      </div>

      <h3>Chords</h3>
      <div className="keys">
        {chords.map((c) => <button key={c} onClick={() => styleEngine.setChord(c)}>{c}</button>)}
      </div>

      <h3>Keyboard Simulator</h3>
      <div className="keys">
        {keys.map(([name, note]) => <button key={note} onClick={() => midiRuntime.simulateNote(note)}>{name}</button>)}
      </div>

      <h3>Runtime Events</h3>
      <pre>{events.map((e) => `${e.type} ${JSON.stringify(e.payload)}`).join("\n")}</pre>
    </section>
  );
}
