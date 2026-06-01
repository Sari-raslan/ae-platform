import "./style.css";

export default function App() {
  return (
    <main>
      <h1>Universal Arranger OS</h1>

      <p className="ok">
        Windows Distribution Release Ready
      </p>

      <section className="panel">
        <h2>v2.4.0 Stable Distribution Build</h2>

        <div className="grid">
          <div className="box">
            <h3>Desktop Runtime</h3>
            <p>Electron Stable</p>
          </div>

          <div className="box">
            <h3>Frontend Runtime</h3>
            <p>React / Vite Production Build</p>
          </div>

          <div className="box">
            <h3>MIDI</h3>
            <p>Real MIDI Foundation Ready</p>
          </div>

          <div className="box">
            <h3>Audio</h3>
            <p>DSP Foundation Ready</p>
          </div>

          <div className="box">
            <h3>Live Performance</h3>
            <p>Scene / Section / Setlist Ready</p>
          </div>

          <div className="box">
            <h3>Distribution</h3>
            <p>Installer + Portable EXE Ready</p>
          </div>
        </div>
      </section>
    </main>
  );
}
