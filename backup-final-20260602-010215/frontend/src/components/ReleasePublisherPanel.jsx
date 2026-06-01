import { useMemo, useState } from "react";
import { createReleasePublisherRuntime } from "../release/releasePublisherRuntime.js";

export default function ReleasePublisherPanel() {
  const runtime = useMemo(() => createReleasePublisherRuntime(), []);
  const [state, setState] = useState(runtime.snapshot());

  function done(key) {
    setState(runtime.mark(key));
  }

  return (
    <section className="runtime">
      <h2>Release Publishing Panel</h2>

      <div className="controls">
        <button onClick={() => done("githubRelease")}>
          GITHUB RELEASE CREATED
        </button>

        <button onClick={() => done("installerUploaded")}>
          INSTALLER UPLOADED
        </button>

        <button onClick={() => done("portableUploaded")}>
          PORTABLE UPLOADED
        </button>

        <button onClick={() => done("releasePublished")}>
          RELEASE PUBLISHED
        </button>
      </div>

      <div className="grid">
        {state.assets.map((asset) => (
          <div className="card" key={asset}>
            <span>ASSET</span>
            <strong>{asset}</strong>
          </div>
        ))}
      </div>

      <pre>{JSON.stringify(state, null, 2)}</pre>
    </section>
  );
}
