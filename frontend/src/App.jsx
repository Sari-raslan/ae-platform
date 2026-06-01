import "./style.css";
import MidiPanel from "./ui/MidiPanel.jsx";

export default function App() {
  return (
    <main>
      <h1>Universal Arranger OS</h1>

      <p className="ok">
        Real MIDI Runtime Online
      </p>

      <MidiPanel />
    </main>
  );
}
