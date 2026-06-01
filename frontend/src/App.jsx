import "./style.css";
import YamahaTrackPanel from "./ui/YamahaTrackPanel.jsx";

export default function App() {

  return (
    <main>

      <h1>
        Universal Arranger OS
      </h1>

      <p className="ok">
        Real Yamaha Track Playback Online
      </p>

      <YamahaTrackPanel />

    </main>
  );

}
