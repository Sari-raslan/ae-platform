import "./style.css";
import FinalWorkstationPanel from "./ui/FinalWorkstationPanel.jsx";

export default function App() {
  return (
    <main>
      <h1>Universal Arranger OS</h1>
      <p className="ok">Final MIDI + DSP + Arranger Runtime Online</p>
      <FinalWorkstationPanel />
    </main>
  );
}
