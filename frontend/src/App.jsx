import "./style.css";

export default function App(){

  return(

    <main>

      <h1>Universal Arranger OS</h1>

      <p className="ok">
        TITAN WORKSTATION ONLINE
      </p>

      <section className="panel">

        <h2>TITAN Runtime Core</h2>

        <div className="grid">

          <div className="box">
            <h3>Electron Runtime</h3>
            <p>Stable</p>
          </div>

          <div className="box">
            <h3>Audio DSP Engine</h3>
            <p>Realtime DSP Ready</p>
          </div>

          <div className="box">
            <h3>MIDI Runtime</h3>
            <p>Hardware MIDI Ready</p>
          </div>

          <div className="box">
            <h3>Arranger Runtime</h3>
            <p>Realtime Style Engine Ready</p>
          </div>

          <div className="box">
            <h3>Sampler Runtime</h3>
            <p>Streaming Samples Ready</p>
          </div>

          <div className="box">
            <h3>Mixer Runtime</h3>
            <p>Bus Routing Ready</p>
          </div>

          <div className="box">
            <h3>Sequencer Runtime</h3>
            <p>Realtime Sequencer Ready</p>
          </div>

          <div className="box">
            <h3>Plugin Runtime</h3>
            <p>Plugin Host Ready</p>
          </div>

          <div className="box">
            <h3>Cloud Runtime</h3>
            <p>Cloud Sync Ready</p>
          </div>

          <div className="box">
            <h3>AI Runtime</h3>
            <p>AI Assistant Ready</p>
          </div>

          <div className="box">
            <h3>Recording Runtime</h3>
            <p>Audio Recording Ready</p>
          </div>

          <div className="box">
            <h3>Export Runtime</h3>
            <p>WAV / MP3 Export Ready</p>
          </div>

        </div>

      </section>

    </main>
  );
}
