import { useState } from "react";
import { feedbackManager } from "../commercial/FeedbackManager";
import { localLicenseServer } from "../commercial/LocalLicenseServer";

export default function BetaPortalPanel() {
  const [feedback, setFeedback] = useState(feedbackManager.status());
  const [license, setLicense] = useState(localLicenseServer.status());

  const [form, setForm] = useState({
    name: "",
    email: "",
    device: "",
    midi: "",
    rating: "5",
    notes: ""
  });

  const [licenseEmail, setLicenseEmail] = useState("");
  const [licenseKey, setLicenseKey] = useState("");

  function update(name, value) {
    setForm((old) => ({
      ...old,
      [name]: value
    }));
  }

  function submitFeedback() {
    feedbackManager.addFeedback(form);
    setFeedback(feedbackManager.status());

    setForm({
      name: "",
      email: "",
      device: "",
      midi: "",
      rating: "5",
      notes: ""
    });
  }

  function exportFeedback() {
    const blob = new Blob(
      [JSON.stringify(feedbackManager.exportJSON(), null, 2)],
      { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "uaos-beta-feedback.json";
    a.click();

    URL.revokeObjectURL(url);
  }

  function generateLicense() {
    const item = localLicenseServer.generateLicense(licenseEmail || "beta@uaos.local");
    setLicense(localLicenseServer.status());
    setLicenseKey(item.key);
  }

  function activateLicense() {
    const result = localLicenseServer.activate(licenseKey);
    setLicense(localLicenseServer.status());
    alert(result.message);
  }

  return (
    <section className="panel">
      <h2>Beta Feedback + License Portal</h2>

      <div className="grid">
        <div className="box">
          <h3>Beta Feedback</h3>

          <input placeholder="Name" value={form.name} onChange={(e) => update("name", e.target.value)} />
          <input placeholder="Email" value={form.email} onChange={(e) => update("email", e.target.value)} />
          <input placeholder="Device" value={form.device} onChange={(e) => update("device", e.target.value)} />
          <input placeholder="MIDI Keyboard" value={form.midi} onChange={(e) => update("midi", e.target.value)} />

          <label>Rating</label>
          <input type="number" min="1" max="5" value={form.rating} onChange={(e) => update("rating", e.target.value)} />

          <textarea placeholder="Notes" value={form.notes} onChange={(e) => update("notes", e.target.value)} />

          <div className="toolbar">
            <button onClick={submitFeedback}>Submit Feedback</button>
            <button onClick={exportFeedback}>Export Feedback</button>
            <button onClick={() => {
              feedbackManager.clear();
              setFeedback(feedbackManager.status());
            }}>
              Clear
            </button>
          </div>

          <p>Total Feedback: {feedback.total}</p>
        </div>

        <div className="box">
          <h3>Local License Generator</h3>

          <input
            placeholder="Customer email"
            value={licenseEmail}
            onChange={(e) => setLicenseEmail(e.target.value)}
          />

          <button onClick={generateLicense}>Generate Beta License</button>

          <input
            placeholder="License key"
            value={licenseKey}
            onChange={(e) => setLicenseKey(e.target.value)}
          />

          <button onClick={activateLicense}>Activate License</button>

          <p>Activated: {String(license.activated)}</p>
          <p>Active Key: {license.active || "None"}</p>
          <p>Total Licenses: {license.licenses.length}</p>
        </div>
      </div>

      <div className="box">
        <h3>Feedback List</h3>
        <pre>{JSON.stringify(feedback.items, null, 2)}</pre>
      </div>

      <div className="box">
        <h3>License List</h3>
        <pre>{JSON.stringify(license.licenses, null, 2)}</pre>
      </div>
    </section>
  );
}
