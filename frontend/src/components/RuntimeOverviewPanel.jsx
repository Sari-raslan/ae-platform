import React, { useEffect, useState } from "react";
import { fetchRuntimeOverview } from "../services/runtimeOverviewApi.js";

export default function RuntimeOverviewPanel() {
  const [overview, setOverview] = useState(null);
  const [error, setError] = useState(null);

  async function loadOverview() {
    try {
      setError(null);
      const data = await fetchRuntimeOverview();
      setOverview(data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadOverview();
  }, []);

  return (
    <section className="rounded-2xl border border-white/10 bg-black/30 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Runtime Overview</h2>
        <button
          onClick={loadOverview}
          className="rounded-lg bg-white/10 px-3 py-1 text-sm text-white"
        >
          Refresh
        </button>
      </div>

      {error && <div className="text-sm text-red-300">{error}</div>}

      {!overview && !error && (
        <div className="text-sm text-white/60">Loading runtime overview...</div>
      )}

      {overview && (
        <div className="grid gap-3 text-sm text-white/70 md:grid-cols-3">
          <div>Status: {overview.status || "unknown"}</div>
          <div>Mode: {overview.mode || "unknown"}</div>
          <div>Stage: {overview.stage || "unknown"}</div>
          <div>Remaining: {(overview.remainingTasks || []).length}</div>
          <div>Generated: {overview.generatedAt || "—"}</div>
        </div>
      )}
    </section>
  );
}
