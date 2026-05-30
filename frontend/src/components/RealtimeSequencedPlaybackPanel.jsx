import { useMemo, useState } from "react";
import { createRealtimeSequencedPlaybackLoop } from "../audio/realtimeSequencedPlaybackLoop.js";

export default function RealtimeSequencedPlaybackPanel() {
  const loop = useMemo(() => createRealtimeSequencedPlaybackLoop({ tempo: 120 }), []);
  const [state, setState] = useState(loop.snapshot());
  const [error, setError] = useState(null);

  async function start() {
    try {
      const next = await loop.start();
      setState(next);
      setError(null);

      const uiTimer = setInterval(() => {
        const current = loop.snapshot();
        setState(current);

        if (!current.running) {
          clearInterval(uiTimer);
        }
      }, 120);
    } catch (err) {
      setError(err.message);
    }
  }

  function stop() {
    setState(loop.stop());
  }

  function reset() {
    setState(loop.reset());
  }

  function tempo(value) {
    setState(loop.setTempo(value));
  }

  function stepOnce() {
    setState(loop.pulse());
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-black/30 p-4">
      <h2 className="mb-2 text-xl font-semibold text-white">
        Realtime Sequenced Playback Loop
      </h2>

      <p className="mb-4 text-sm text-white/60">
        Plays a demo arranger pattern automatically through WebAudio.
      </p>

      <div className="mb-4 flex flex-wrap gap-2">
        <button onClick={start} className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white">
          Start Loop
        </button>

        <button onClick={stop} className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white">
          Stop
        </button>

        <button onClick={reset} className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white">
          Reset
        </button>

        <button onClick={stepOnce} className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white">
          Step
        </button>

        <button onClick={() => tempo(90)} className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white">
          90 BPM
        </button>

        <button onClick={() => tempo(120)} className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white">
          120 BPM
        </button>

        <button onClick={() => tempo(140)} className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white">
          140 BPM
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-xl bg-red-500/20 p-3 text-sm text-red-100">
          {error}
        </div>
      )}

      <pre className="max-h-[460px] overflow-auto rounded-xl bg-black/40 p-4 text-xs text-white/80">
        {JSON.stringify(state, null, 2)}
      </pre>
    </section>
  );
}
