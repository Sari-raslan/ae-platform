import "./style.css";
import AudioWorkletPanel from "./ui/AudioWorkletPanel.jsx";

export default function App() {
  return (
    <main>
      <h1>Universal Arranger OS</h1>
      <p className="ok">AudioWorklet DSP Foundation Online</p>
      <AudioWorkletPanel />
    </main>
  );
}
