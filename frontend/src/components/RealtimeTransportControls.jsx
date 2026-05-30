import { useState } from "react";

export default function RealtimeTransportControls() {
  const [status, setStatus] = useState(null);

  async function send(type, extra = {}) {
    try {
      const response = await fetch("/api/runtime/command", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          ...extra,
        }),
      });

      const json = await response.json();
      setStatus(json);
    } catch (error) {
      setStatus({
        ok: false,
        error: error.message,
      });
    }
  }

  return (
    <div className="runtime-controls">
      <h2>Realtime Runtime Controls</h2>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button onClick={() => send("start")}>Start</button>
        <button onClick={() => send("stop")}>Stop</button>
        <button onClick={() => send("status")}>Status</button>
        <button onClick={() => send("tempo", { tempo: 128 })}>
          Tempo 128
        </button>
      </div>

      <pre style={{ marginTop: 16 }}>
        {JSON.stringify(status, null, 2)}
      </pre>
    </div>
  );
}
