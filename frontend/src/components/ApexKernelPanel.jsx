import { useEffect, useState } from "react";

export default function ApexKernelPanel() {
  const [state, setState] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch("/api/runtime/apex-kernel");
        const json = await response.json();
        setState(json);
      } catch (error) {
        setState({
          ok: false,
          error: error.message,
        });
      }
    }

    load();
  }, []);

  return (
    <div>
      <h2>Apex Runtime Kernel</h2>

      <pre>
        {JSON.stringify(state, null, 2)}
      </pre>
    </div>
  );
}
