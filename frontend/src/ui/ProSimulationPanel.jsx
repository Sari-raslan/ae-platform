import { useState } from "react";
import { proAccessManager } from "../pro/ProAccessManager";

export default function ProSimulationPanel() {
  const [status, setStatus] = useState(proAccessManager.status());
  const [licenseKey, setLicenseKey] = useState("");
  const [events, setEvents] = useState([]);

  function log(type, message) {
    setEvents((old) => [
      {
        type,
        message,
        time: new Date().toLocaleTimeString()
      },
      ...old
    ].slice(0, 25));
  }

  function proOnly(actionName) {
    const result = proAccessManager.guard(actionName);

    if (!result.allowed) {
      log("blocked", result.message);
      alert(result.message);
      return;
    }

    log("success", `${actionName} completed in Pro Mode.`);
  }

  function activate() {
    const result = proAccessManager.activate(licenseKey);
    alert(result.message);
    setStatus(proAccessManager.status());

    if (result.ok) {
      log("license", "Pro Mode activated.");
    }
  }

  function reset() {
    proAccessManager.resetToSimulation();
    setStatus(proAccessManager.status());
    log("license", "Returned to Simulation Mode.");
  }

  return (
    <section className="panel simulation-panel">
      <div className="sim-banner">
        {status.isPro ? (
          <strong>PRO MODE ACTIVE  Full production unlocked</strong>
        ) : (
          <strong>SIMULATION MODE  Explore all tools, real production disabled</strong>
        )}
      </div>

      <h2>Universal Arranger OS Pro Simulation</h2>

      <div className="grid">
        <div className="box">
          <h3>Access Status</h3>
          <p>Mode: {status.mode}</p>
          <p>Pro Active: {String(status.isPro)}</p>
          <p>License: {status.licensePreview || "None"}</p>

          <input
            placeholder="Enter Pro license key"
            value={licenseKey}
            onChange={(e) => setLicenseKey(e.target.value)}
          />

          <div className="toolbar">
            <button onClick={activate}>Activate Pro</button>
            <button onClick={reset}>Reset Simulation</button>
          </div>
        </div>

        <div className="box">
          <h3>Simulation Allowed</h3>
          <p> Browse interface</p>
          <p> Try arranger controls</p>
          <p> Test UI workflow</p>
          <p> Preview sounds</p>
          <p> Explore MIDI panels</p>
          <p> Learn the system</p>
        </div>

        <div className="box locked">
          <h3>Pro Locked Actions</h3>
          <p>Real save, export, song production, set creation, commercial workflow, and release outputs are locked in Simulation Mode.</p>

          <div className="toolbar">
            <button onClick={() => proOnly("Save Project")}>Save Project</button>
            <button onClick={() => proOnly("Export Song")}>Export Song</button>
            <button onClick={() => proOnly("Create Set")}>Create Set</button>
            <button onClick={() => proOnly("Render Audio")}>Render Audio</button>
            <button onClick={() => proOnly("Export MIDI")}>Export MIDI</button>
            <button onClick={() => proOnly("Commercial Release")}>Commercial Release</button>
          </div>
        </div>

        <div className="box">
          <h3>Upgrade</h3>
          <p>Use Simulation Mode to test the full experience. Upgrade to Pro when ready to create real songs, save sets, export MIDI/audio, and use production features.</p>

          <button onClick={() => window.open("http://localhost:8787", "_blank")}>
            Open Purchase / License Server
          </button>
        </div>
      </div>

      <div className="box">
        <h3>Activity</h3>
        <pre>{events.map((e) => `${e.time} ${e.type}: ${e.message}`).join("\n")}</pre>
      </div>
    </section>
  );
}
