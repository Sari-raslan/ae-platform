import { useMemo, useState } from "react";
import { createLivePerformanceScheduler } from "../audio/livePerformanceScheduler.js";

export default function ProfessionalArrangerRuntimePanel() {
  const runtime = useMemo(() => createLivePerformanceScheduler(), []);
  const [state, setState] = useState(runtime.snapshot());

  async function start() {
    await runtime.start();

    const timer = setInterval(() => {
      runtime.pulse();
      const current = runtime.snapshot();
      setState(current);

      if (!current.transport.running) {
        clearInterval(timer);
      }
    }, 120);

    setState(runtime.snapshot());
  }

  function stop() {
    runtime.stop();
    setState(runtime.snapshot());
  }

  function chord(name) {
    runtime.setChord(name);
    setState(runtime.snapshot());
  }

  function section(name) {
    runtime.setSection(name);
    setState(runtime.snapshot());
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-black/30 p-4">
      <h2 className="mb-2 text-xl font-semibold text-white">
        Professional Arranger Runtime
      </h2>

      <p className="mb-4 text-sm text-white/60">
        Live arranger playback with chord-follow and style sections.
      </p>

      <div className="mb-4 flex flex-wrap gap-2">
        <button onClick={start} className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white">
          Start Runtime
        </button>

        <button onClick={stop} className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white">
          Stop Runtime
        </button>

        <button onClick={() => section("INTRO1")} className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white">
          INTRO1
        </button>

        <button onClick={() => section("VAR1")} className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white">
          VAR1
        </button>

        <button onClick={() => section("VAR2")} className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white">
          VAR2
        </button>

        <button onClick={() => section("ENDING1")} className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white">
          ENDING1
        </button>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <button onClick={() => chord("C major")} className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white">
          C
        </button>

        <button onClick={() => chord("D major")} className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white">
          D
        </button>

        <button onClick={() => chord("E minor")} className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white">
          Em
        </button>

        <button onClick={() => chord("A minor")} className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white">
          Am
        </button>
      </div>

      <pre className="max-h-[520px] overflow-auto rounded-xl bg-black/40 p-4 text-xs text-white/80">
        {JSON.stringify(state, null, 2)}
      </pre>
    </section>
  );
}
