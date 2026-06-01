import "./style.css";
import PianoRollPanel from "./ui/PianoRollPanel.jsx";

export default function App() {

  return (
    <main>

      <h1>
        Universal Arranger OS
      </h1>

      <p className="ok">
        Piano Roll + MIDI Recorder Online
      </p>

      <PianoRollPanel />

    </main>
  );

}
