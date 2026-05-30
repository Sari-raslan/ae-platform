import { useMemo, useState } from "react";
import { createWebAudioRuntime } from "../audio/webAudioRuntime.js";

export default function WebAudioRuntimePanel() {
  const audio = useMemo(() => createWebAudioRuntime(), []);
  const [state, setState] = useState(audio.snapshot());
  const [log, setLog] = useState([]);

  async function start() {
    const next = await audio.start();
    setState(next);
  }

  function play(note) {
    try {
      const event = audio.playMidiNote(note, 110);
      setLog((current) => [event, ...current].slice(0, 20));
      setState(audio.snapshot());
    } catch (error) {
      setLog((current) => [{ ok: false, error: error.message }, ...current].slice(0, 20));
    }
  }

  function stop() {
    setState(audio.stop());
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-black/30 p-4">
      <h2 className="mb-2 text-xl font-semibold text-white">WebAudio Runtime</h2>
      <p className="mb-4 text-sm text-white/60">
        Real browser audio output test for arranger playback.
      </p>

      <div className="mb-4 flex flex-wrap gap-2">
        <button onClick={start} className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white">
          Start Audio
        </button>
        <button onClick={() => play(60)} className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white">
          C4
        </button>
        <button onClick={() => play(64)} className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white">
          E4
        </button>
        <button onClick={() => play(67)} className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white">
          G4
        </button>
        <button onClick={stop} className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white">
          Stop
        </button>
      </div>

      <pre className="max-h-[360px] overflow-auto rounded-xl bg-black/40 p-4 text-xs text-white/80">
        {JSON.stringify({ state, log }, null, 2)}
      </pre>
    </section>
  );
}
