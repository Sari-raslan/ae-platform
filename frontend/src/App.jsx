import "./style.css";
import MidiArrangerPanel from "./ui/MidiArrangerPanel.jsx";

export default function App() {
  return (
    <main>
      <h1>Universal Arranger OS</h1>
      <p className="ok">MIDI Chord Detection + Arranger Control Online</p>
      <MidiArrangerPanel />
    </main>
  );
}
