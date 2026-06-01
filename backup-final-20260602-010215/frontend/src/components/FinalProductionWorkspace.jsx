import React from "react";

// Import all dashboard panels
import MidiDashboard from "./MidiDashboard.jsx";
import AIDashboard from "./ai/AIDashboard.jsx";
import UltimateDashboard from "./ultimate/UltimateDashboard.jsx";
import ArrangerDashboard from "./arranger/ArrangerDashboard.jsx";
import LivePerformancePanel from "./LivePerformancePanel.jsx";
import StyleRuntimePanel from "./StyleRuntimePanel.jsx";
import ProjectPhasePanel from "./ProjectPhasePanel.jsx";
import StabilizationDashboard from "./StabilizationDashboard.jsx";
import ReleaseNotesPanel from "./ReleaseNotesPanel.jsx";

export default function FinalProductionWorkspace() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8 text-white">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Universal Arranger OS
          </h1>
          <p className="mt-2 text-sm text-white/60">
            v0.3.0-midi-foundation-plan • Stabilization track active • Ready for v1.0
          </p>
        </div>

        {/* Stabilization & Release Info */}
        <div className="mb-8 grid gap-4 md:grid-cols-2">
          <StabilizationDashboard />
          <ReleaseNotesPanel />
        </div>

        {/* Phase & Project Status */}
        <ProjectPhasePanel />

        {/* Performance Runtimes */}
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <LivePerformancePanel />
          <StyleRuntimePanel />
        </div>

        {/* Dashboards */}
        <div className="mt-8 space-y-6">
          <MidiDashboard />
          <AIDashboard />
          <UltimateDashboard />
          <ArrangerDashboard />
        </div>

        {/* Footer */}
        <div className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-white/40">
          <p>
            Universal Arranger OS • Phase v0.3.0 • Stabilization Mode Active • 
            {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </main>
  );
}
