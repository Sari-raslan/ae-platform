import React from "react";

export default function StyleBankGrid({ catalog, conflicts }) {
  return (
    <div className="style-bank-grid">
      <h3>Bank Grid</h3>
      <pre>{JSON.stringify(catalog, null, 2)}</pre>
    </div>
  );
}
