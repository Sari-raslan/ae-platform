import "./style.css";
import UniversalStyleParserPanel from "./ui/UniversalStyleParserPanel.jsx";

export default function App() {
  return (
    <main>
      <h1>Universal Arranger OS</h1>
      <p className="ok">Yamaha + KORG Style Parser Foundation Online</p>
      <UniversalStyleParserPanel />
    </main>
  );
}
