import { useState } from "react";
import { postLaunchManager } from "../postlaunch/PostLaunchManager";

export default function PostLaunchPanel() {
  const [status, setStatus] = useState(postLaunchManager.status());
  const [licenseKey, setLicenseKey] = useState("");
  const [feedback, setFeedback] = useState({
    name: "",
    email: "",
    rating: "5",
    notes: ""
  });

  function updateFeedback(name, value) {
    setFeedback((old) => ({ ...old, [name]: value }));
  }

  function submitFeedback() {
    postLaunchManager.addFeedback(feedback);
    setFeedback({ name: "", email: "", rating: "5", notes: "" });
    setStatus(postLaunchManager.status());
  }

  function activate() {
    const result = postLaunchManager.activateLicense(licenseKey);
    alert(result.message);
    setStatus(postLaunchManager.status());
  }

  function checkUpdates() {
    const result = postLaunchManager.checkUpdate();
    alert(result.updateAvailable ? "Update available" : "You are up to date");
    setStatus(postLaunchManager.status());
  }

  function exportFeedback() {
    const blob = new Blob([JSON.stringify(postLaunchManager.exportFeedback(), null, 2)], {
      type: "application/json"
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "uaos-feedback-export.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function openPurchase() {
    window.open("http://localhost:8787", "_blank");
  }

  return (
    <section className="panel">
      <h2>Post-Launch Control Center</h2>

      <div className="toolbar">
        <button onClick={checkUpdates}>Check Updates</button>
        <button onClick={openPurchase}>Open Purchase / License Server</button>
        <button onClick={exportFeedback}>Export Feedback</button>
      </div>

      <div className="grid">
        <div className="box">
          <h3>License</h3>
          <p>Activated: {String(status.licensed)}</p>
          <p>Key: {status.licensePreview || "None"}</p>
          <input
            placeholder="License key"
            value={licenseKey}
            onChange={(e) => setLicenseKey(e.target.value)}
          />
          <button onClick={activate}>Activate</button>
        </div>

        <div className="box">
          <h3>Beta / Customer Feedback</h3>
          <input placeholder="Name" value={feedback.name} onChange={(e) => updateFeedback("name", e.target.value)} />
          <input placeholder="Email" value={feedback.email} onChange={(e) => updateFeedback("email", e.target.value)} />
          <input type="number" min="1" max="5" value={feedback.rating} onChange={(e) => updateFeedback("rating", e.target.value)} />
          <textarea placeholder="Notes" value={feedback.notes} onChange={(e) => updateFeedback("notes", e.target.value)} />
          <button onClick={submitFeedback}>Submit Feedback</button>
          <p>Total: {status.feedbackTotal}</p>
        </div>
      </div>

      <div className="box">
        <h3>Post-Launch Events</h3>
        <pre>{status.events.map((e) => `${e.type} ${JSON.stringify(e.data)}`).join("\n")}</pre>
      </div>
    </section>
  );
}
