import { useEffect, useMemo, useState }
from "react";

import { createRealTimeAudioGraph }
from "../audio/realTimeAudioGraph.js";

import { createLiveTransportEngine }
from "../runtime/liveTransportEngine.js";

import { createLiveStyleEngine }
from "../styles/liveStyleEngine.js";

import { createLiveDrumEngine }
from "../engine/audio/liveDrumEngine.js";

import { createRealtimeChordEngine }
from "../engine/chords/realtimeChordEngine.js";

import { createStyleVariationEngine }
from "../engine/styles/styleVariationEngine.js";

import { createLivePerformanceEngine }
from "../engine/performance/livePerformanceEngine.js";

export default function RealtimeProductionSuite() {

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

  const drums = useMemo(
    () => createLiveDrumEngine(audio),
    []
  );

  const chords = useMemo(
    () => createRealtimeChordEngine(),
    []
  );

  const variations = useMemo(
    () => createStyleVariationEngine(),
    []
  );

  const performance = useMemo(
    () => createLivePerformanceEngine(),
    []
  );

  const [state, setState] = useState({
    running: false,
    transport: transport.snapshot(),
    style: styles.snapshot(),
    drums: drums.snapshot(),
    chords: chords.snapshot(),
    variations: variations.snapshot(),
    performance: performance.snapshot(),
  });

  useEffect(() => {

    let timer = null;

    if (state.running) {

      timer = setInterval(() => {

        const t =
          transport.pulse();

        const notes =
          styles.notes();

        const note =
          notes[
            t.tick % notes.length
          ];

        audio.beep(note, 0.10);

        drums.trigger(t.tick);

        setState({
          running: true,
          transport: transport.snapshot(),
          style: styles.snapshot(),
          drums: drums.snapshot(),
          chords: chords.snapshot(),
          variations: variations.snapshot(),
          performance: performance.snapshot(),
        });

      }, 140);

    }

    return () => {
      if (timer) clearInterval(timer);
    };

  }, [state.running]);

  function start() {

    transport.start();

    setState((current) => ({
      ...current,
      running: true,
      transport: transport.snapshot(),
    }));
  }

  function stop() {

    transport.stop();

    setState((current) => ({
      ...current,
      running: false,
      transport: transport.snapshot(),
    }));
  }

  function style(name) {

    styles.setStyle(name);

    setState((current) => ({
      ...current,
      style: styles.snapshot(),
    }));
  }

  function variation(name) {

    variations.setVariation(name);

    setState((current) => ({
      ...current,
      variations: variations.snapshot(),
    }));
  }

  function chord(notes) {

    chords.detect(notes);

    setState((current) => ({
      ...current,
      chords: chords.snapshot(),
    }));
  }

  function fill() {

    performance.fill();

    audio.beep(600, 0.12);

    setState((current) => ({
      ...current,
      performance: performance.snapshot(),
    }));
  }

  function pad() {

    performance.pad();

    audio.beep(720, 0.10);

    setState((current) => ({
      ...current,
      performance: performance.snapshot(),
    }));
  }

  function registration() {

    performance.registration();

    setState((current) => ({
      ...current,
      performance: performance.snapshot(),
    }));
  }

  return (
    <main className="min-h-screen bg-neutral-950 p-5 text-white">

      <section className="mx-auto max-w-7xl rounded-2xl border border-white/10 bg-black/40 p-5">

        <h1 className="text-4xl font-bold">
          Universal Arranger OS
        </h1>

        <p className="mt-2 text-white/60">
          Realtime Production Suite
        </p>

        <div className="mt-5 flex flex-wrap gap-2">

          <button
            onClick={start}
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

          <button
            onClick={() => variation("VAR1")}
            className="rounded-xl bg-white/10 px-4 py-2"
          >
            VAR1
          </button>

          <button
            onClick={() => variation("VAR2")}
            className="rounded-xl bg-white/10 px-4 py-2"
          >
            VAR2
          </button>

          <button
            onClick={() => chord(["C"])}
            className="rounded-xl bg-white/10 px-4 py-2"
          >
            C MAJOR
          </button>

          <button
            onClick={() => chord(["A"])}
            className="rounded-xl bg-white/10 px-4 py-2"
          >
            A MINOR
          </button>

          <button
            onClick={fill}
            className="rounded-xl bg-white/10 px-4 py-2"
          >
            FILL
          </button>

          <button
            onClick={pad}
            className="rounded-xl bg-white/10 px-4 py-2"
          >
            PAD
          </button>

          <button
            onClick={registration}
            className="rounded-xl bg-white/10 px-4 py-2"
          >
            SAVE REG
          </button>

        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-5">

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
              VARIATION
            </div>

            <div className="mt-2 text-2xl font-bold">
              {state.variations.variation}
            </div>
          </div>

          <div className="rounded-xl bg-white/5 p-4">
            <div className="text-sm text-white/50">
              CHORD
            </div>

            <div className="mt-2 text-2xl font-bold">
              {state.chords.currentChord}
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
