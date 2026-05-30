import { useMemo, useState } from "react";

import { createUltimateArrangerOperatingSystem }
from "../kernel/ultimateArrangerOperatingSystem.js";

export default function UltimateArrangerOperatingSystemPanel() {
  const os = useMemo(
    () => createUltimateArrangerOperatingSystem(),
    []
  );

  const [state, setState] = useState(
    os.snapshot()
  );

  async function boot() {
    await os.boot();

    const timer = setInterval(() => {
      os.realtimeCycle();

      const current = os.snapshot();

      setState(current);

      if (!current.system.booted) {
        clearInterval(timer);
      }
    }, 80);

    setState(os.snapshot());
  }

  function shutdown() {
    os.shutdown();
    setState(os.snapshot());
  }

  function chord(notes) {
    os.performChord(notes);
    setState(os.snapshot());
  }

  function variation(name) {
    os.switchVariation(name);
    setState(os.snapshot());
  }

  function fill(name) {
    os.triggerRealtimeFill(name);
    setState(os.snapshot());
  }

  function pad(name) {
    os.triggerLivePad(name);
    setState(os.snapshot());
  }

  function sample(note) {
    os.triggerRealtimeSample(note);
    setState(os.snapshot());
  }

  function mixer(channel, value) {
    os.setMixer(channel, value);
    setState(os.snapshot());
  }

  function registration() {
    os.saveRealtimeRegistration();
    setState(os.snapshot());
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-black/40 p-5">
      <h2 className="mb-2 text-3xl font-bold text-white">
        Ultimate Arranger Operating System
      </h2>

      <p className="mb-4 text-sm text-white/60">
        Final integrated realtime arranger workstation runtime.
      </p>

      <div className="mb-4 flex flex-wrap gap-2">

        <button
          onClick={boot}
          className="rounded-xl bg-emerald-500/20 px-4 py-2 text-sm text-white"
        >
          BOOT OS
        </button>

        <button
          onClick={shutdown}
          className="rounded-xl bg-red-500/20 px-4 py-2 text-sm text-white"
        >
          SHUTDOWN
        </button>

        <button
          onClick={() => chord([60,64,67])}
          className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white"
        >
          C MAJOR
        </button>

        <button
          onClick={() => chord([57,60,64])}
          className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white"
        >
          A MINOR
        </button>

        <button
          onClick={() => variation("VAR1")}
          className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white"
        >
          VAR1
        </button>

        <button
          onClick={() => variation("VAR2")}
          className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white"
        >
          VAR2
        </button>

        <button
          onClick={() => fill("FILL1")}
          className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white"
        >
          FILL
        </button>

        <button
          onClick={() => pad("PAD1")}
          className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white"
        >
          PAD1
        </button>

        <button
          onClick={() => sample(36)}
          className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white"
        >
          KICK
        </button>

        <button
          onClick={() => mixer("master", 127)}
          className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white"
        >
          MASTER
        </button>

        <button
          onClick={registration}
          className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white"
        >
          SAVE REG
        </button>

      </div>

      <pre className="max-h-[760px] overflow-auto rounded-xl bg-black/50 p-4 text-xs text-white/80">
        {JSON.stringify(state, null, 2)}
      </pre>
    </section>
  );
}
