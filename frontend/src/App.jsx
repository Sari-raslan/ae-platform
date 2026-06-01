import "./style.css";
import LivePerformancePanel from "./ui/LivePerformancePanel.jsx";

export default function App() {
  return (
    <main>
      <h1>Universal Arranger OS</h1>
      <p className="ok">Live Performance Mode Online</p>
      <LivePerformancePanel />
    </main>
  );
}
