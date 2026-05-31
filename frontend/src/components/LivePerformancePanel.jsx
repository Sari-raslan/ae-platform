import { useMemo, useState } from "react";
import { createLivePerformanceRuntime } from "../performance/livePerformanceRuntime.js";

const TEST_EVENTS = {
  cMajor: [
    { type: "note-on", note: 48, velocity: 100, channel: 1 },
    { type: "note-on", note: 52, velocity: 100, channel: 1 },
    { type: "note-on", note: 55, velocity: 100, channel: 1 },
  ],
  aMinor: [
    { type: "note-on", note: 45, velocity: 100, channel: 1 },
    { type: "note-on", note: 48, velocity: 100, channel: 1 },
    { type: "note-on", note: 52, velocity: 100, channel: 1 },
  ],
  rightLead: [
    { type: "note-on", note: 72, velocity: 112, channel: 1 },
  ],
};

export default function LivePerformancePanel() {
  const runtime = useMemo(() => createLivePerformanceRuntime(), []);
  const [state, setState] = useState(runtime.snapshot());

  function start() {
    runtime.start();
    setState(runtime.snapshot());
  }

  function stop() {
    runtime.stop();
    setState(runtime.snapshot());
  }

  function feed(events) {
    for (const event of events) {
      runtime.feedMidi(event);
    }

    setState(runtime.snapshot());
  }

  return (
    <section className="mt-5 rounded-2xl border border-white/10 bg-black/40 p-5 text-white">
      <h2 className="text-2xl font-bold">Live Performance Runtime</h2>

      <p className="mt-2 text-sm text-white/60">
        v0.4.0 keyboard split, chord detection, and live performance state.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={start} className="rounded-xl bg-emerald-500/20 px-4 py-2">
          Start Performance
        </button>

        <button onClick={stop} className="rounded-xl bg-red-500/20 px-4 py-2">
          Stop Performance
        </button>

        <button onClick={() => feed(TEST_EVENTS.cMajor)} className="rounded-xl bg-white/10 px-4 py-2">
          Test C Major
        </button>

        <button onClick={() => feed(TEST_EVENTS.aMinor)} className="rounded-xl bg-white/10 px-4 py-2">
          Test A Minor
        </button>

        <button onClick={() => feed(TEST_EVENTS.rightLead)} className="rounded-xl bg-white/10 px-4 py-2">
          Test Right Lead
        </button>

        <button onClick={() => { runtime.setTempo(90); setState(runtime.snapshot()); }} className="rounded-xl bg-white/10 px-4 py-2">
          90 BPM
        </button>

        <button onClick={() => { runtime.setTempo(120); setState(runtime.snapshot()); }} className="rounded-xl bg-white/10 px-4 py-2">
          120 BPM
        </button>
      </div>

      <pre className="mt-4 max-h-[420px] overflow-auto rounded-xl bg-black/60 p-4 text-xs text-white/80">
        {JSON.stringify(state, null, 2)}
      </pre>
    </section>
  );
}
