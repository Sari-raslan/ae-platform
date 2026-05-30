import { useMemo } from "react";
import { createFinalPhaseRegistry } from "../kernel/finalPhaseRegistry.js";

export default function FinalPhaseRegistryPanel() {
  const registry = useMemo(() => createFinalPhaseRegistry(), []);

  return (
    <section className="rounded-2xl border border-white/10 bg-black/50 p-5">
      <h2 className="mb-2 text-3xl font-bold text-white">
        Final Integration Phase
      </h2>

      <p className="mb-4 text-sm text-white/60">
        Experimental layers are frozen. The project now moves into final runtime integration.
      </p>

      <pre className="max-h-[640px] overflow-auto rounded-xl bg-black/60 p-4 text-xs text-white/80">
        {JSON.stringify(registry, null, 2)}
      </pre>
    </section>
  );
}
