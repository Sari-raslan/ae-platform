import React, { useEffect, useState } from "react";

export default function StyleBankViewer() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/korg/integrity")
      .then((r) => r.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) {
    return <div>Loading STYLE banks...</div>;
  }

  return (
    <div className="style-bank-viewer">
      <h2>STYLE Bank Viewer</h2>

      <pre>
        {JSON.stringify(data.styleBankCatalog, null, 2)}
      </pre>
    </div>
  );
}
