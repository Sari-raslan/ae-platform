import { useEffect, useState } from "react";

export default function FinalRuntimeKernelPanel() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch("/api/runtime/final-kernel");
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
      <h2>Final Runtime Kernel</h2>

      <pre>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
