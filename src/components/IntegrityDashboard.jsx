import React from "react";

export default function IntegrityDashboard({ viewModel }) {
  const view = viewModel || {
    title: "Korg SET Integrity",
    status: "unknown",
    healthScore: null,
    cards: [],
    runtime: {},
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-black/30 p-4 shadow-lg">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">{view.title}</h2>
          <p className="text-sm text-white/60">
            Status: <span className="font-medium">{view.status}</span>
          </p>
        </div>

        <div className="rounded-xl bg-white/10 px-4 py-2 text-right">
          <div className="text-xs text-white/50">Health</div>
          <div className="text-2xl font-bold text-white">
            {view.healthScore ?? "—"}
          </div>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        {(view.cards || []).map((card) => (
          <div
            key={card.id}
            className="rounded-xl border border-white/10 bg-white/5 p-3"
          >
            <div className="text-xs uppercase tracking-wide text-white/50">
              {card.label}
            </div>
            <div className="mt-2 text-2xl font-semibold text-white">
              {card.value ?? "—"}
            </div>
            <div className="mt-1 text-xs text-white/40">
              {card.severity}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3">
        <div className="text-sm font-medium text-white">Runtime</div>
        <div className="mt-2 grid gap-2 text-sm text-white/60 md:grid-cols-4">
          <div>Ready: {String(view.runtime?.ready || false)}</div>
          <div>Transport: {view.runtime?.transportState || "unknown"}</div>
          <div>Clock: {view.runtime?.clock || "unknown"}</div>
          <div>MIDI: {view.runtime?.midiInput || "default"} → {view.runtime?.midiOutput || "default"}</div>
        </div>
      </div>
    </section>
  );
}
