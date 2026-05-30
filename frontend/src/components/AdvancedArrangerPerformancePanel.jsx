import { useMemo, useState } from "react";
import { createRealtimeFillEngine } from "../audio/realtimeFillEngine.js";
import { createVariationSwitchEngine } from "../audio/variationSwitchEngine.js";
import { createRealtimeGrooveEngine } from "../audio/realtimeGrooveEngine.js";

export default function AdvancedArrangerPerformancePanel() {
  const fills = useMemo(() => createRealtimeFillEngine(), []);
  const variations = useMemo(() => createVariationSwitchEngine(), []);
  const groove = useMemo(() => createRealtimeGrooveEngine(), []);

  const [state, setState] = useState({
    fills: fills.snapshot(),
    variations: variations.snapshot(),
    groove: groove.snapshot(),
  });

  function refresh() {
    setState({
      fills: fills.snapshot(),
      variations: variations.snapshot(),
      groove: groove.snapshot(),
    });
  }

  function fill(name) {
    fills.trigger(name);
    refresh();
  }

  function variation(name) {
    variations.queue(name);
    variations.apply();
    refresh();
  }

  function swing(value) {
    groove.setSwing(value);
    refresh();
  }

  function humanize(value) {
    groove.setHumanize(value);
    refresh();
  }

  function grooveType(name) {
    groove.setGroove(name);
    refresh();
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-black/30 p-4">
      <h2 className="mb-2 text-xl font-semibold text-white">
        Advanced Arranger Performance
      </h2>

      <p className="mb-4 text-sm text-white/60">
        Realtime fills, variation switching, and groove timing.
      </p>

      <div className="mb-4 flex flex-wrap gap-2">
        <button onClick={() => fill("FILL1")} className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white">
          Fill 1
        </button>

        <button onClick={() => fill("FILL2")} className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white">
          Fill 2
        </button>

        <button onClick={() => variation("VAR1")} className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white">
          VAR1
        </button>

        <button onClick={() => variation("VAR2")} className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white">
          VAR2
        </button>

        <button onClick={() => variation("VAR3")} className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white">
          VAR3
        </button>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <button onClick={() => swing(0)} className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white">
          Swing 0
        </button>

        <button onClick={() => swing(30)} className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white">
          Swing 30
        </button>

        <button onClick={() => swing(60)} className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white">
          Swing 60
        </button>

        <button onClick={() => humanize(0)} className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white">
          Humanize 0
        </button>

        <button onClick={() => humanize(20)} className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white">
          Humanize 20
        </button>

        <button onClick={() => grooveType("shuffle")} className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white">
          Shuffle
        </button>

        <button onClick={() => grooveType("latin")} className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white">
          Latin
        </button>
      </div>

      <pre className="max-h-[480px] overflow-auto rounded-xl bg-black/40 p-4 text-xs text-white/80">
        {JSON.stringify(state, null, 2)}
      </pre>
    </section>
  );
}
