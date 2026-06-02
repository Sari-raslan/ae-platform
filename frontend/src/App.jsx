import "./style.css";

export default function App() {
  function openPurchase() {
    window.open("http://localhost:8787", "_blank");
  }

  function openReleases() {
    window.open("https://github.com/Sari-raslan/ae-platform/releases", "_blank");
  }

  return (
    <main>
      <h1>Universal Arranger OS</h1>
      <p className="ok">Official Launch Candidate Ready</p>

      <section className="panel">
        <h2>v8.0.0 Official Launch Candidate</h2>

        <div className="toolbar">
          <button onClick={openPurchase}>Purchase / License Server</button>
          <button onClick={openReleases}>GitHub Releases</button>
        </div>

        <div className="grid">
          <div className="box"><h3>Desktop Runtime</h3><p>Ready</p></div>
          <div className="box"><h3>Installer</h3><p>Release pipeline ready</p></div>
          <div className="box"><h3>License API</h3><p>Local server foundation ready</p></div>
          <div className="box"><h3>Stripe Checkout</h3><p>Ready when env keys are configured</p></div>
          <div className="box"><h3>Legal Docs</h3><p>Privacy / Terms / EULA created</p></div>
          <div className="box"><h3>Beta Feedback</h3><p>Form ready</p></div>
        </div>
      </section>
    </main>
  );
}
