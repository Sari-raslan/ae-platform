import { useEffect, useState } from "react";

export default function RuntimeExecutionPanel() {
  const [state, setState] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch("/api/runtime/execution");
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
      <h2>Runtime Execution Platform</h2>

      <pre>
        {JSON.stringify(state, null, 2)}
      </pre>
    </div>
  );
}
