import { useEffect, useState } from "react";

export default function MidiDashboard() {
  const [devices, setDevices] = useState({
    inputs: [],
    outputs: []
  });

  async function loadDevices() {
    try {
      const res = await fetch("http://localhost:4000/api/midi/devices");
      const json = await res.json();
      setDevices(json);
    } catch {}
  }

  useEffect(() => {
    loadDevices();
  }, []);

  return (
    <div className="midi-dashboard">
      <h2>MIDI Devices</h2>

      <div className="midi-grid">
        <div>
          <h3>Inputs</h3>
          {devices.inputs?.map(d => (
            <div key={d.id} className="midi-card">
              {d.name}
            </div>
          ))}
        </div>

        <div>
          <h3>Outputs</h3>
          {devices.outputs?.map(d => (
            <div key={d.id} className="midi-card">
              {d.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
