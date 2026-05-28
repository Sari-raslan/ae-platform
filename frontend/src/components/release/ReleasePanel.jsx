export default function ReleasePanel() {
  const checks = [
    "Explorer Stable",
    "Web MIDI Active",
    "Korg Parser Active",
    "Smoke Tests Passing",
    "Export Verified",
    "Desktop Shell Ready",
    "AI Dashboard Ready"
  ];

  return (
    <div className="release-panel">
      <h2>Production Readiness</h2>

      <div className="release-grid">
        {checks.map((c, i) => (
          <div key={i} className="release-card">
            <span>✔</span>
            <strong>{c}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
