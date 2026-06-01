import "./style.css";
import MidiFileParserPanel from "./ui/MidiFileParserPanel.jsx";

export default function App() {
  return (
    <main>
      <h1>Universal Arranger OS</h1>
      <p className="ok">MIDI File Event Parser Foundation Online</p>
      <MidiFileParserPanel />
    </main>
  );
}
