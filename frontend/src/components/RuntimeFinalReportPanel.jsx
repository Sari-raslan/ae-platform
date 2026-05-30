import { useEffect, useState } from "react";

export default function RuntimeFinalReportPanel() {
  const [report, setReport] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch("/api/runtime/final-report");
        const json = await response.json();
        setReport(json);
      } catch (error) {
        setReport({
          ok: false,
          error: error.message,
        });
      }
    }

    load();
  }, []);

  return (
    <div>
      <h2>Runtime Final Report</h2>
      <pre>{JSON.stringify(report, null, 2)}</pre>
    </div>
  );
}
