import { useMemo } from "react";
import { createProjectPhaseRuntime } from "../release/projectPhaseRuntime.js";

export default function ProjectPhasePanel() {
  const runtime = useMemo(() => createProjectPhaseRuntime(), []);
  const state = runtime.snapshot();

  return (
    <section className="mt-5 rounded-2xl border border-white/10 bg-black/40 p-5 text-white">
      <h2 className="text-2xl font-bold">Project Phase / Release Readiness</h2>

      <p className="mt-2 text-sm text-white/60">
        Stabilization tracker before desktop packaging and official release.
      </p>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-xl bg-white/5 p-4">
          <h3 className="font-bold">Phases</h3>
          <ul className="mt-2 list-inside list-disc text-sm text-white/80">
            {state.phases.map((phase) => (
              <li key={phase.id}>
                {phase.id} — {phase.name}: {phase.status}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl bg-yellow-500/10 p-4">
          <h3 className="font-bold">Remaining Before v1.0</h3>
          <ul className="mt-2 list-inside list-disc text-sm text-white/80">
            {state.blockers.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <pre className="mt-4 max-h-[340px] overflow-auto rounded-xl bg-black/60 p-4 text-xs text-white/80">
        {JSON.stringify(state, null, 2)}
      </pre>
    </section>
  );
}
