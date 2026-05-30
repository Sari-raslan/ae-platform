import React from "react";

export default function StyleConflictPanel({ conflicts, catalog }) {
  return (
    <div className="style-conflict-panel">
      <h3>Conflicts</h3>
      <pre>{JSON.stringify(conflicts, null, 2)}</pre>
    </div>
  );
}
