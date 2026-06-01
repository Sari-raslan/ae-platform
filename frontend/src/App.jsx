import "./style.css";
import RealMidiPanel from "./ui/RealMidiPanel.jsx";

export default function App() {
  return (
    <main>
      <h1>Universal Arranger OS</h1>

      <p className="ok">
        Real MIDI + Audio Test Runtime Online
      </p>

      <RealMidiPanel />
    </main>
  );
}
