import "./style.css";
import KeygroupSamplerPanel from "./ui/KeygroupSamplerPanel.jsx";

export default function App() {
  return (
    <main>
      <h1>Universal Arranger OS</h1>
      <p className="ok">Sample Keygroups + Velocity Layers Online</p>
      <KeygroupSamplerPanel />
    </main>
  );
}
