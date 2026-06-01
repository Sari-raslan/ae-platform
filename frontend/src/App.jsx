import "./style.css";

export default function App() {
  return (
    <main>
      <h1>Universal Arranger OS</h1>

      <p className="ok">
        Integrated Professional Workstation Online
      </p>

      <section className="panel">
        <h2>v4.4.0 Integrated Runtime Dashboard</h2>

        <div className="grid">
          <div className="box">
            <h3>Real MIDI</h3>
            <p>Input / chord detection / performance control ready.</p>
          </div>

          <div className="box">
            <h3>Arranger Engine</h3>
            <p>Intro / Main / Fill / Ending logic ready.</p>
          </div>

          <div className="box">
            <h3>Audio DSP</h3>
            <p>Synth, filter, compressor, AudioWorklet foundation ready.</p>
          </div>

          <div className="box">
            <h3>Style Parser</h3>
            <p>Yamaha / KORG parser foundation ready.</p>
          </div>

          <div className="box">
            <h3>Sampler</h3>
            <p>Keygroups and velocity layers ready.</p>
          </div>

          <div className="box">
            <h3>Mixer / Project</h3>
            <p>Save / load project foundation ready.</p>
          </div>

          <div className="box">
            <h3>DAW Timeline</h3>
            <p>Piano roll and MIDI recorder ready.</p>
          </div>

          <div className="box">
            <h3>Live Performance</h3>
            <p>Scenes, setlists, and stage mode ready.</p>
          </div>

          <div className="box">
            <h3>Plugin Host</h3>
            <p>Plugin and preset system ready.</p>
          </div>

          <div className="box">
            <h3>Desktop Distribution</h3>
            <p>Installer and portable EXE ready.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
