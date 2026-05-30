import { useEffect, useState } from "react";

export default function RuntimeMasterPanel() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch("/api/runtime/master");
        const json = await response.json();
        setData(json);
      } catch (error) {
        setData({
          ok: false,
          error: error.message,
        });
      }
    }

    load();
  }, []);

  return (
    <div>
      <h2>Runtime Master System</h2>

      <pre>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
