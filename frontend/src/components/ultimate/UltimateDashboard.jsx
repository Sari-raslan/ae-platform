import { useEffect, useState } from "react";

export default function UltimateDashboard() {

  const [status,setStatus] = useState(null);

  useEffect(() => {
    fetch("http://localhost:4000/api/ultimate/status")
      .then(r => r.json())
      .then(setStatus)
      .catch(() => {});
  }, []);

  return (
    <div className="ultimate-dashboard">

      <h1>Keyboard Manager Ultimate</h1>

      <div className="ultimate-grid">

        <div className="ultimate-card">
          <span>Production</span>
          <strong>{status?.production ? "READY" : "NO"}</strong>
        </div>

        <div className="ultimate-card">
          <span>Desktop</span>
          <strong>{status?.desktopReady ? "READY" : "NO"}</strong>
        </div>

        <div className="ultimate-card">
          <span>Android</span>
          <strong>{status?.androidReady ? "READY" : "NO"}</strong>
        </div>

        <div className="ultimate-card">
          <span>iOS</span>
          <strong>{status?.iosReady ? "READY" : "NO"}</strong>
        </div>

        <div className="ultimate-card">
          <span>AI</span>
          <strong>{status?.aiReady ? "READY" : "NO"}</strong>
        </div>

        <div className="ultimate-card">
          <span>MIDI</span>
          <strong>{status?.midiReady ? "READY" : "NO"}</strong>
        </div>

      </div>
    </div>
  );
}
