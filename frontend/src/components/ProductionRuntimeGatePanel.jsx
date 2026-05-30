import { useMemo } from "react";
import { createProductionRuntimeGate } from "../kernel/productionRuntimeGate.js";

export default function ProductionRuntimeGatePanel() {
  const gate = useMemo(() => createProductionRuntimeGate(), []);

  return (
    <section className="rounded-2xl border border-white/10 bg-black/50 p-5">
      <h2 className="mb-2 text-3xl font-bold text-white">
        Production Runtime Gate
      </h2>

      <p className="mb-4 text-sm text-white/60">
        Final readiness layer for the arranger workstation runtime.
      </p>

      <pre className="max-h-[520px] overflow-auto rounded-xl bg-black/60 p-4 text-xs text-white/80">
        {JSON.stringify(gate, null, 2)}
      </pre>
    </section>
  );
}
