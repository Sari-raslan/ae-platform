import MidiRuntimePanel from "./ui/MidiRuntimePanel.jsx";
import "./style.css";

export default function App() {
  return (
    <main>
      <h1>Universal Arranger OS</h1>
      <p className="ok">Runtime OK  v1.1.0 MIDI Runtime</p>
      <MidiRuntimePanel />
    </main>
  );
}
