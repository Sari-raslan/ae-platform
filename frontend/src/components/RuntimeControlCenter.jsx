import { useEffect, useState } from "react";

const ENDPOINTS = [
  ["/api/runtime/execution", "Execution Platform"],
  ["/api/runtime/final-kernel", "Final Kernel"],
  ["/api/runtime/global-kernel", "Global Kernel"],
  ["/api/runtime/final-report", "Final Report"],
  ["/api/runtime/universe-kernel", "Universe Kernel"],
  ["/api/runtime/infinite-kernel", "Infinite Kernel"],
  ["/api/runtime/omega-kernel", "Omega Kernel"],
  ["/api/runtime/apex-kernel", "Apex Kernel"],
  ["/api/runtime/singularity-kernel", "Singularity Kernel"],
];

export default function RuntimeControlCenter() {
  const [selected, setSelected] = useState(ENDPOINTS[0][0]);
  const [payload, setPayload] = useState(null);
  const [error, setError] = useState(null);

  async function load(endpoint = selected) {
    try {
      setError(null);
      setPayload(null);

      const response = await fetch(endpoint);
      const json = await response.json();

      setPayload(json);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    load(selected);
  }, [selected]);

  return (
    <section className="rounded-2xl border border-white/10 bg-black/30 p-4">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-white">
          Runtime Control Center
        </h2>
        <p className="text-sm text-white/60">
          Unified view for experimental runtime systems.
        </p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {ENDPOINTS.map(([endpoint, label]) => (
          <button
            key={endpoint}
            onClick={() => setSelected(endpoint)}
            className="rounded-lg bg-white/10 px-3 py-2 text-sm text-white"
          >
            {label}
          </button>
        ))}

        <button
          onClick={() => load(selected)}
          className="rounded-lg bg-white/20 px-3 py-2 text-sm text-white"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-xl bg-red-500/20 p-3 text-sm text-red-100">
          {error}
        </div>
      )}

      {!payload && !error && (
        <div className="text-sm text-white/60">Loading runtime data...</div>
      )}

      {payload && (
        <pre className="max-h-[520px] overflow-auto rounded-xl bg-black/40 p-4 text-xs text-white/80">
          {JSON.stringify(payload, null, 2)}
        </pre>
      )}
    </section>
  );
}
