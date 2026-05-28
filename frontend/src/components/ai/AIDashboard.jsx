import { useEffect, useState } from "react";

export default function AIDashboard() {
  const [cloud, setCloud] = useState(null);

  useEffect(() => {
    fetch("http://localhost:4000/api/ai/cloud")
      .then(r => r.json())
      .then(setCloud)
      .catch(() => {});
  }, []);

  return (
    <div className="ai-dashboard">
      <h2>AI + Cloud Status</h2>

      <div className="ai-grid">
        <div className="ai-card">
          <span>Deploy Ready</span>
          <strong>
            {cloud?.deployReady ? "YES" : "NO"}
          </strong>
        </div>

        <div className="ai-card">
          <span>Cloud Sync</span>
          <strong>
            {cloud?.sync ? "ACTIVE" : "LOCAL"}
          </strong>
        </div>

        <div className="ai-card">
          <span>Mode</span>
          <strong>
            {cloud?.mode || "UNKNOWN"}
          </strong>
        </div>
      </div>
    </div>
  );
}
