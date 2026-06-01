import "./style.css";
import ArrangerPanel from "./ui/ArrangerPanel.jsx";

export default function App() {
  return (
    <main>
      <h1>Universal Arranger OS</h1>

      <p className="ok">
        Real Arranger Playback Engine Online
      </p>

      <ArrangerPanel />
    </main>
  );
}
