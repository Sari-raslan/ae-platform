import "./style.css";

export default function App(){

  return(

    <main>

      <h1>Universal Arranger OS</h1>

      <p className="ok">
        ENTERPRISE AI WORKSTATION ONLINE
      </p>

      <section className="panel">

        <h2>Runtime Status</h2>

        <div className="grid">

          <div className="box">
            <h3>MIDI Engine</h3>
            <p>READY</p>
          </div>

          <div className="box">
            <h3>Audio DSP</h3>
            <p>READY</p>
          </div>

          <div className="box">
            <h3>Arranger Runtime</h3>
            <p>READY</p>
          </div>

          <div className="box">
            <h3>Sample Runtime</h3>
            <p>READY</p>
          </div>

          <div className="box">
            <h3>AI Runtime</h3>
            <p>READY</p>
          </div>

          <div className="box">
            <h3>Cloud Runtime</h3>
            <p>READY</p>
          </div>

        </div>

      </section>

    </main>
  );
}
