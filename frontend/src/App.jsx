import StyleEnginePanel from "./ui/StyleEnginePanel.jsx";
import "./style.css";

export default function App() {
  return (
    <main>
      <h1>Universal Arranger OS</h1>
      <p className="ok">Runtime OK  v1.3.0 Arranger Style Engine</p>
      <StyleEnginePanel />
    </main>
  );
}
