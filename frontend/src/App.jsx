import "./style.css";
import StyleProPanel from "./ui/StyleProPanel.jsx";

export default function App() {
  return (
    <main>
      <h1>Universal Arranger OS</h1>
      <p className="ok">Style Parser + MIDI Routing + Sample Library Online</p>
      <StyleProPanel />
    </main>
  );
}
