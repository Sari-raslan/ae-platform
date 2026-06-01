import { useMemo } from "react";
import { createReleaseNotesTemplate } from "../release/releaseNotesTemplate.js";

export default function ReleaseNotesPanel() {
  const template = useMemo(() => createReleaseNotesTemplate(), []);
  const data = template.snapshot();

  return (
    <section className="mt-5 rounded-2xl border border-white/10 bg-black/40 p-5 text-white">
      <h2 className="text-2xl font-bold">Release Notes — v1.0.0</h2>

      <p className="mt-2 text-sm text-white/60">
        Universal Arranger OS official release
      </p>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {/* Highlights */}
        <div className="rounded-xl bg-white/5 p-4">
          <h3 className="font-bold text-emerald-400">Highlights</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-white/80">
            {data.highlights.slice(0, 5).map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
          <div className="mt-2 text-xs text-white/60">+ {data.highlights.length - 5} more</div>
        </div>

        {/* Compatibility */}
        <div className="rounded-xl bg-white/5 p-4">
          <h3 className="font-bold text-blue-400">Compatibility</h3>
          <div className="mt-2 space-y-2 text-sm">
            <div>
              <div className="text-xs text-white/60">Operating Systems</div>
              <div className="text-white/80">{data.compatibility.OS.join(", ")}</div>
            </div>
            <div>
              <div className="text-xs text-white/60">Browsers</div>
              <div className="text-white/80">{data.compatibility.Browsers.join(", ")}</div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="rounded-xl bg-white/5 p-4">
          <h3 className="font-bold text-purple-400">Key Features</h3>
          <div className="mt-2 space-y-2 text-sm">
            {Object.entries(data.features).map(([category, items]) => (
              <div key={category}>
                <div className="font-mono text-xs text-white/60">{category}</div>
                <div className="text-white/80">{items.length} features</div>
              </div>
            ))}
          </div>
        </div>

        {/* Installation */}
        <div className="rounded-xl bg-white/5 p-4">
          <h3 className="font-bold text-cyan-400">Get Started</h3>
          <div className="mt-2 space-y-2 text-xs text-white/80">
            <div>Desktop: Run installer</div>
            <div>Web: Visit https://universal-arranger.app</div>
            <div>Source: Clone from GitHub</div>
          </div>
        </div>
      </div>

      {/* Known Limitations */}
      <div className="mt-4 rounded-xl bg-yellow-500/10 p-4">
        <h3 className="font-bold text-yellow-200">Known Limitations</h3>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-white/80">
          {data.knownLimitations.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
      </div>

      {/* Phases Timeline */}
      <div className="mt-4 rounded-xl bg-white/5 p-4">
        <h3 className="font-bold">Development Phases</h3>
        <div className="mt-2 space-y-1 text-xs text-white/80">
          {data.phases.map((phase) => (
            <div key={phase}>{phase}</div>
          ))}
        </div>
      </div>

      {/* Download Button */}
      <div className="mt-4 flex gap-2">
        <button className="rounded-xl bg-emerald-500/20 px-6 py-2 font-mono text-sm hover:bg-emerald-500/30">
          Download for Desktop
        </button>
        <button className="rounded-xl bg-blue-500/20 px-6 py-2 font-mono text-sm hover:bg-blue-500/30">
          Open Web Version
        </button>
      </div>

      {/* Raw JSON */}
      <pre className="mt-4 max-h-[300px] overflow-auto rounded-xl bg-black/60 p-4 text-xs text-white/80">
        {JSON.stringify(data, null, 2)}
      </pre>
    </section>
  );
}
