import { useEffect, useMemo, useState } from "react";

import { createRealTimeAudioGraph }
from "../audio/realTimeAudioGraph.js";

import { createLiveTransportEngine }
from "../runtime/liveTransportEngine.js";

import { createLiveStyleEngine }
from "../styles/liveStyleEngine.js";

export default function ProductionArrangerWorkspace() {

  const audio = useMemo(
    () => createRealTimeAudioGraph(),
    []
  );

  const transport = useMemo(
    () => createLiveTransportEngine(),
    []
  );

  const styles = useMemo(
    () => createLiveStyleEngine(),
    []
  );

  const [state, setState] = useState({
    transport: transport.snapshot(),
    style: styles.snapshot(),
    running: false,
  });

  useEffect(() => {

    let timer = null;

    if (state.running) {

      timer = setInterval(() => {

        const t = transport.pulse();

        const pattern =
          styles.notes();

        const note =
          pattern[
            t.tick % pattern.length
          ];

        audio.beep(note, 0.12);

        setState({
          transport: transport.snapshot(),
          style: styles.snapshot(),
          running: true,
        });

      }, 150);

    }

    return () => {
      if (timer) clearInterval(timer);
    };

  }, [state.running]);

  function boot() {
    transport.start();

    setState({
      transport: transport.snapshot(),
      style: styles.snapshot(),
      running: true,
    });
  }

  function stop() {
    transport.stop();

    setState({
      transport: transport.snapshot(),
      style: styles.snapshot(),
      running: false,
    });
  }

  function style(name) {
    styles.setStyle(name);

    setState({
      transport: transport.snapshot(),
      style: styles.snapshot(),
      running: state.running,
    });
  }

  return (
    <main className="min-h-screen bg-neutral-950 p-5 text-white">

      <section className="mx-auto max-w-6xl rounded-2xl border border-white/10 bg-black/40 p-5">

        <h1 className="text-4xl font-bold">
          Universal Arranger OS
        </h1>

        <p className="mt-2 text-white/60">
          Production Arranger Workspace
        </p>

        <div className="mt-5 flex flex-wrap gap-2">

          <button
            onClick={boot}
            className="rounded-xl bg-emerald-500/20 px-4 py-2"
          >
            START
          </button>

          <button
            onClick={stop}
            className="rounded-xl bg-red-500/20 px-4 py-2"
          >
            STOP
          </button>

          <button
            onClick={() => style("POP")}
            className="rounded-xl bg-white/10 px-4 py-2"
          >
            POP
          </button>

          <button
            onClick={() => style("DANCE")}
            className="rounded-xl bg-white/10 px-4 py-2"
          >
            DANCE
          </button>

          <button
            onClick={() => style("BALLAD")}
            className="rounded-xl bg-white/10 px-4 py-2"
          >
            BALLAD
          </button>

        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-4">

          <div className="rounded-xl bg-white/5 p-4">
            <div className="text-sm text-white/50">
              BAR
            </div>

            <div className="mt-2 text-2xl font-bold">
              {state.transport.bar}
            </div>
          </div>

          <div className="rounded-xl bg-white/5 p-4">
            <div className="text-sm text-white/50">
              BEAT
            </div>

            <div className="mt-2 text-2xl font-bold">
              {state.transport.beat}
            </div>
          </div>

          <div className="rounded-xl bg-white/5 p-4">
            <div className="text-sm text-white/50">
              STYLE
            </div>

            <div className="mt-2 text-2xl font-bold">
              {state.style.current}
            </div>
          </div>

          <div className="rounded-xl bg-white/5 p-4">
            <div className="text-sm text-white/50">
              STATUS
            </div>

            <div className="mt-2 text-2xl font-bold">
              {state.running ? "LIVE" : "STOPPED"}
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
