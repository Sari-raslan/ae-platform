import { useMemo, useState } from "react";
import { createProjectPhaseRuntime } from "../release/projectPhaseRuntime.js";

export default function StabilizationDashboard() {
  const runtime = useMemo(() => createProjectPhaseRuntime(), []);
  const [state, setState] = useState(runtime.snapshot());
  
  const completedPhases = state.phases.filter(p => 
    p.status === "deployed" || p.status === "implemented-or-ready"
  ).length;
  
  const progressPercent = (completedPhases / state.phases.length) * 100;

  return (
    <section className="mt-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-5 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Stabilization Dashboard</h2>
          <p className="mt-1 text-sm text-white/60">
            {completedPhases}/{state.phases.length} phases ready • {Math.round(progressPercent)}% complete
          </p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold text-emerald-400">{Math.round(progressPercent)}%</div>
          <div className="text-xs text-white/60">Progress to v1.0</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4 h-2 w-full rounded-full bg-white/10">
        <div 
          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Phase Timeline */}
      <div className="mt-6 space-y-2">
        <h3 className="font-bold text-white/80">Phase Timeline</h3>
        <div className="space-y-1 text-sm">
          {state.phases.map((phase, idx) => (
            <div key={phase.id} className="flex items-center gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-xs">
                {idx + 1}
              </div>
              <div className="flex-1">
                <span className="font-mono">{phase.id}</span>
                <span className="ml-2 text-white/60">{phase.name}</span>
              </div>
              <span className="rounded-full bg-white/10 px-2 py-1 text-xs">
                {phase.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Blockers Section */}
      <div className="mt-6 rounded-xl bg-yellow-500/10 p-4">
        <h3 className="font-bold text-yellow-200">Remaining Blockers ({state.blockers.length})</h3>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-white/80">
          {state.blockers.map((blocker) => (
            <li key={blocker}>{blocker}</li>
          ))}
        </ul>
      </div>

      {/* Status Boxes */}
      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <div className="rounded-xl bg-white/5 p-4">
          <div className="text-xs text-white/60">Current Track</div>
          <div className="mt-1 font-bold">{state.currentTrack}</div>
        </div>
        <div className="rounded-xl bg-white/5 p-4">
          <div className="text-xs text-white/60">Release Target</div>
          <div className="mt-1 font-bold text-emerald-400">{state.releaseTarget}</div>
        </div>
        <div className="rounded-xl bg-white/5 p-4">
          <div className="text-xs text-white/60">Ready for v1.0</div>
          <div className="mt-1 font-bold text-red-400">{state.readyForV1 ? "YES" : "NO"}</div>
        </div>
      </div>

      {/* JSON Output */}
      <pre className="mt-4 max-h-[300px] overflow-auto rounded-xl bg-black/60 p-4 text-xs text-white/80">
        {JSON.stringify(state, null, 2)}
      </pre>
    </section>
  );
}
