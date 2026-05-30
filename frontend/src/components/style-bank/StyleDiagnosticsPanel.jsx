import React from "react";

export default function StyleDiagnosticsPanel({ diagnostics, catalog }) {
  return (
    <div className="style-diagnostics-panel">
      <h3>Diagnostics</h3>
      <pre>{JSON.stringify(diagnostics, null, 2)}</pre>
    </div>
  );
}
