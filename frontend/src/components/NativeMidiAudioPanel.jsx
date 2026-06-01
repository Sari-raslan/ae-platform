import { useMemo, useState } from "react";
import { createNativeMidiAudioRuntime } from "../native/nativeMidiAudioRuntime.js";

export default function NativeMidiAudioPanel() {
  const runtime = useMemo(() => createNativeMidiAudioRuntime(), []);
  const [state, setState] = useState(runtime.snapshot());

  async function startAudio() {
    setState(await runtime.startAudio());
  }

  async function connectMidi() {
    setState(await runtime.connectMidi());
  }

  function testTone(freq) {
    setState(runtime.tone(freq));
  }

  return (
    <section className="runtime">
      <h2>Native MIDI + Audio Integration</h2>

      <div className="controls">
        <button onClick={startAudio}>START AUDIO</button>
        <button onClick={connectMidi}>CONNECT MIDI</button>
        <button onClick={() => testTone(220)}>A3</button>
        <button onClick={() => testTone(440)}>A4</button>
        <button onClick={() => testTone(880)}>A5</button>
      </div>

      <pre>{JSON.stringify(state, null, 2)}</pre>
    </section>
  );
}
