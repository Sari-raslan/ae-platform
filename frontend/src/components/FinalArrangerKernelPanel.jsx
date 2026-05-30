import { useMemo, useState } from "react";
import { createFinalArrangerKernel } from "../kernel/finalArrangerKernel.js";

export default function FinalArrangerKernelPanel() {
  const kernel = useMemo(
    () => createFinalArrangerKernel(),
    []
  );

  const [state, setState] = useState(
    kernel.snapshot()
  );

  async function boot() {
    await kernel.boot();

    const timer = setInterval(() => {
      kernel.pulse();

      const current = kernel.snapshot();

      setState(current);

      if (!current.runtime.running) {
        clearInterval(timer);
      }
    }, 100);

    setState(kernel.snapshot());
  }

  function shutdown() {
    kernel.shutdown();
    setState(kernel.snapshot());
  }

  function chord(notes) {
    kernel.setChord(notes);
    setState(kernel.snapshot());
  }

  function variation(name) {
    kernel.setVariation(name);
    setState(kernel.snapshot());
  }

  function fill(name) {
    kernel.triggerFill(name);
    setState(kernel.snapshot());
  }

  function pad(name) {
    kernel.triggerPad(name);
    setState(kernel.snapshot());
  }

  function sample(note) {
    kernel.playSample(note);
    setState(kernel.snapshot());
  }

  function registration() {
    kernel.saveRegistration();
    setState(kernel.snapshot());
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-black/30 p-4">
      <h2 className="mb-2 text-2xl font-bold text-white">
        Final Arranger Kernel
      </h2>

      <p className="mb-4 text-sm text-white/60">
        Integrated realtime arranger workstation runtime.
      </p>

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={boot}
          className="rounded-xl bg-emerald-500/20 px-4 py-2 text-sm text-white"
        >
          Boot Kernel
        </button>

        <button
          onClick={shutdown}
          className="rounded-xl bg-red-500/20 px-4 py-2 text-sm text-white"
        >
          Shutdown
        </button>

        <button
          onClick={() => chord([60,64,67])}
          className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white"
        >
          C Major
        </button>

        <button
          onClick={() => chord([57,60,64])}
          className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white"
        >
          A Minor
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
          Fill
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
          Kick
        </button>

        <button
          onClick={registration}
          className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white"
        >
          Save Registration
        </button>
      </div>

      <pre className="max-h-[720px] overflow-auto rounded-xl bg-black/40 p-4 text-xs text-white/80">
        {JSON.stringify(state, null, 2)}
      </pre>
    </section>
  );
}
