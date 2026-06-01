import "./style.css";

export default function App() {

  return (
    <main>

      <h1>Universal Arranger OS</h1>

      <p className="ok">
        Professional Workstation Runtime ONLINE
      </p>

      <section className="panel">

        <h2>Runtime Status</h2>

        <div className="grid">

          <div className="box">
            <h3>Electron Runtime</h3>
            <p>Stable</p>
          </div>

          <div className="box">
            <h3>Audio Engine</h3>
            <p>DSP Ready</p>
          </div>

          <div className="box">
            <h3>MIDI Runtime</h3>
            <p>Ready</p>
          </div>

          <div className="box">
            <h3>Style Engine</h3>
            <p>Arranger Runtime Ready</p>
          </div>

          <div className="box">
            <h3>Sample Engine</h3>
            <p>Multisample Ready</p>
          </div>

          <div className="box">
            <h3>Desktop Build</h3>
            <p>Packaging Ready</p>
          </div>

        </div>

      </section>

    </main>
  );
}
