import { useEffect, useState } from "react";

export default function LiveRuntimePanel() {
  const [state, setState] = useState({
    loading: true,
    error: null,
    data: null,
  });

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const response = await fetch("/api/runtime/dashboard");
        const json = await response.json();

        if (!active) return;

        setState({
          loading: false,
          error: null,
          data: json,
        });
      } catch (error) {
        setState({
          loading: false,
          error: error.message,
          data: null,
        });
      }
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  if (state.loading) {
    return (
      <div className="runtime-panel">
        <h2>Live Runtime</h2>
        <p>Loading runtime dashboard...</p>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="runtime-panel">
        <h2>Live Runtime</h2>
        <p>Error: {state.error}</p>
      </div>
    );
  }

  const dashboard = state.data?.dashboard || {};
  const summary = dashboard.summary || {};

  return (
    <div className="runtime-panel">
      <h2>Live Runtime Dashboard</h2>

      <ul>
        <li>SET: {summary.setName}</li>
        <li>Transport: {summary.transport}</li>
        <li>Tempo: {summary.tempo}</li>
        <li>Style Queue: {summary.styleQueue}</li>
        <li>PCM Cache: {summary.pcmCache}</li>
        <li>Health: {summary.health}</li>
      </ul>
    </div>
  );
}
