import "./style.css";
import AudioDSPPanel from "./ui/AudioDSPPanel.jsx";

export default function App() {
  return (
    <main>
      <h1>Universal Arranger OS</h1>

      <p className="ok">
        Audio DSP Engine Runtime Online
      </p>

      <AudioDSPPanel />
    </main>
  );
}
