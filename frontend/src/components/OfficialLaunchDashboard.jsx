import { useEffect, useMemo, useState } from "react";

function createRuntime() {
  return {
    booted: false,
    transport: "stopped",
    tempo: 120,
    variation: "VAR1",
    chord: "C Major",
    cpu: 12,
    events: [],
  };
}

export default function OfficialLaunchDashboard() {
  const runtime = useMemo(() => createRuntime(), []);

  const [state, setState] = useState(runtime);

  useEffect(() => {
    const timer = setInterval(() => {
      setState((current) => ({
        ...current,
        cpu: Math.min(
          100,
          10 + Math.round(Math.random() * 40)
        ),
      }));
    }, 1200);

    return () => clearInterval(timer);
  }, []);

  function push(type) {
    setState((current) => ({
      ...current,

      booted:
        type === "BOOT"
          ? true
          : current.booted,

      transport:
        type === "START_LOOP"
          ? "playing"
          : type === "STOP"
            ? "stopped"
            : current.transport,

      variation:
        type === "VAR2"
          ? "VAR2"
          : type === "VAR1"
            ? "VAR1"
            : current.variation,

      chord:
        type === "AM"
          ? "A Minor"
          : type === "CM"
            ? "C Major"
            : current.chord,

      events: [
        {
          type,
          at: new Date().toISOString(),
        },
        ...current.events,
      ].slice(0, 24),
    }));
  }

  return (
    <main className="min-h-screen bg-neutral-950 p-4 text-white">
      <section className="mx-auto max-w-6xl rounded-2xl border border-white/10 bg-black/40 p-5">

        <h1 className="text-4xl font-bold">
          Universal Arranger OS
        </h1>

        <p className="mt-2 text-white/60">
          Official Launch Dashboard
        </p>

        <div className="mt-6 flex flex-wrap gap-2">

          <button
            onClick={() => push("BOOT")}
            className="rounded-xl bg-emerald-500/20 px-4 py-2"
          >
            BOOT OS
          </button>

          <button
            onClick={() => push("START_AUDIO")}
            className="rounded-xl bg-white/10 px-4 py-2"
          >
            Start Audio
          </button>

          <button
            onClick={() => push("START_LOOP")}
            className="rounded-xl bg-white/10 px-4 py-2"
          >
            Start Loop
          </button>

          <button
            onClick={() => push("VAR1")}
            className="rounded-xl bg-white/10 px-4 py-2"
          >
            VAR1
          </button>

          <button
            onClick={() => push("VAR2")}
            className="rounded-xl bg-white/10 px-4 py-2"
          >
            VAR2
          </button>

          <button
            onClick={() => push("CM")}
            className="rounded-xl bg-white/10 px-4 py-2"
          >
            C Major
          </button>

          <button
            onClick={() => push("AM")}
            className="rounded-xl bg-white/10 px-4 py-2"
          >
            A Minor
          </button>

          <button
            onClick={() => push("FILL")}
            className="rounded-xl bg-white/10 px-4 py-2"
          >
            FILL
          </button>

          <button
            onClick={() => push("PAD1")}
            className="rounded-xl bg-white/10 px-4 py-2"
          >
            PAD1
          </button>

          <button
            onClick={() => push("KICK")}
            className="rounded-xl bg-white/10 px-4 py-2"
          >
            KICK
          </button>

          <button
            onClick={() => push("SAVE_REG")}
            className="rounded-xl bg-white/10 px-4 py-2"
          >
            SAVE REG
          </button>

          <button
            onClick={() => push("STOP")}
            className="rounded-xl bg-red-500/20 px-4 py-2"
          >
            STOP
          </button>

        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-4">

          <div className="rounded-xl bg-white/5 p-4">
            <div className="text-sm text-white/50">
              Runtime
            </div>

            <div className="mt-2 text-xl font-bold">
              {state.booted ? "ONLINE" : "OFFLINE"}
            </div>
          </div>

          <div className="rounded-xl bg-white/5 p-4">
            <div className="text-sm text-white/50">
              Transport
            </div>

            <div className="mt-2 text-xl font-bold">
              {state.transport}
            </div>
          </div>

          <div className="rounded-xl bg-white/5 p-4">
            <div className="text-sm text-white/50">
              Variation
            </div>

            <div className="mt-2 text-xl font-bold">
              {state.variation}
            </div>
          </div>

          <div className="rounded-xl bg-white/5 p-4">
            <div className="text-sm text-white/50">
              CPU
            </div>

            <div className="mt-2 text-xl font-bold">
              {state.cpu}%
            </div>
          </div>

        </div>

        <pre className="mt-6 max-h-[420px] overflow-auto rounded-xl bg-black/60 p-4 text-xs text-white/80">
          {JSON.stringify(state, null, 2)}
        </pre>

      </section>
    </main>
  );
}
