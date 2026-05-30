import { useMemo, useState } from "react";
import { createChordFollowEngine } from "../audio/chordFollowEngine.js";
import { createDynamicBassGenerator } from "../audio/dynamicBassGenerator.js";

export default function RealtimeMusicalIntelligencePanel() {
  const chordEngine = useMemo(() => createChordFollowEngine(), []);
  const bassEngine = useMemo(() => createDynamicBassGenerator(), []);

  const [state, setState] = useState({
    chord: chordEngine.snapshot(),
    bass: bassEngine.snapshot(),
  });

  function detect(notes) {
    const chord = chordEngine.feed(notes);
    const bass = bassEngine.generate(chord.chord || "C major");

    setState({
      chord,
      bass,
    });
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-black/30 p-4">
      <h2 className="mb-2 text-xl font-semibold text-white">
        Realtime Musical Intelligence
      </h2>

      <p className="mb-4 text-sm text-white/60">
        Live chord-follow and dynamic bass generation.
      </p>

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => detect([60,64,67])}
          className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white"
        >
          Detect C Major
        </button>

        <button
          onClick={() => detect([57,60,64])}
          className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white"
        >
          Detect A Minor
        </button>

        <button
          onClick={() => detect([62,66,69])}
          className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white"
        >
          Detect D Major
        </button>
      </div>

      <pre className="max-h-[420px] overflow-auto rounded-xl bg-black/40 p-4 text-xs text-white/80">
        {JSON.stringify(state, null, 2)}
      </pre>
    </section>
  );
}
