import { useMemo, useState } from "react";
import { createArrangerStyleRuntime } from "../styleRuntime/arrangerStyleRuntime.js";

export default function StyleRuntimePanel() {
  const runtime = useMemo(() => createArrangerStyleRuntime(), []);
  const [state, setState] = useState(runtime.snapshot());

  function start() {
    runtime.start();
    setState(runtime.snapshot());
  }

  function stop() {
    runtime.stop();
    setState(runtime.snapshot());
  }

  function pulse(count = 1) {
    for (let i = 0; i < count; i += 1) runtime.pulse();
    setState(runtime.snapshot());
  }

  function section(name) {
    runtime.queueSection(name);
    setState(runtime.snapshot());
  }

  function chord(name) {
    runtime.setChord(name);
    setState(runtime.snapshot());
  }

  return (
    <section className="mt-5 rounded-2xl border border-white/10 bg-black/40 p-5 text-white">
      <h2 className="text-2xl font-bold">Style Runtime</h2>

      <p className="mt-2 text-sm text-white/60">
        v0.5.0 sections, phrase playback, chord transposition, and quantized switching.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={start} className="rounded-xl bg-emerald-500/20 px-4 py-2">Start Style</button>
        <button onClick={stop} className="rounded-xl bg-red-500/20 px-4 py-2">Stop Style</button>
        <button onClick={() => pulse(1)} className="rounded-xl bg-white/10 px-4 py-2">Pulse</button>
        <button onClick={() => pulse(16)} className="rounded-xl bg-white/10 px-4 py-2">1 Bar</button>
        <button onClick={() => section("INTRO1")} className="rounded-xl bg-white/10 px-4 py-2">INTRO1</button>
        <button onClick={() => section("VAR1")} className="rounded-xl bg-white/10 px-4 py-2">VAR1</button>
        <button onClick={() => section("VAR2")} className="rounded-xl bg-white/10 px-4 py-2">VAR2</button>
        <button onClick={() => section("FILL1")} className="rounded-xl bg-white/10 px-4 py-2">FILL1</button>
        <button onClick={() => section("ENDING1")} className="rounded-xl bg-white/10 px-4 py-2">ENDING1</button>
        <button onClick={() => chord("C major")} className="rounded-xl bg-white/10 px-4 py-2">C</button>
        <button onClick={() => chord("D major")} className="rounded-xl bg-white/10 px-4 py-2">D</button>
        <button onClick={() => chord("A minor")} className="rounded-xl bg-white/10 px-4 py-2">Am</button>
      </div>

      <pre className="mt-4 max-h-[460px] overflow-auto rounded-xl bg-black/60 p-4 text-xs text-white/80">
        {JSON.stringify(state, null, 2)}
      </pre>
    </section>
  );
}
