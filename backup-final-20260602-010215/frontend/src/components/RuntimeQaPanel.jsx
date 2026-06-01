import { useMemo, useState } from "react";
import { createRuntimeQaChecklist } from "../qa/runtimeQaChecklist.js";

export default function RuntimeQaPanel() {
  const qa = useMemo(() => createRuntimeQaChecklist(), []);
  const [state, setState] = useState(qa.snapshot());

  function pass(id) {
    setState(qa.pass(id));
  }

  function fail(id) {
    setState(qa.fail(id));
  }

  function reset() {
    setState(qa.reset());
  }

  function note(text) {
    setState(qa.note(text));
  }

  return (
    <section className="runtime">
      <h2>Desktop Runtime QA</h2>

      <p>
        Final checklist before publishing the desktop release.
      </p>

      <div className="controls">
        <button onClick={reset}>RESET QA</button>
        <button onClick={() => note("Manual QA checkpoint completed")}>ADD NOTE</button>
      </div>

      <div className="grid">
        {state.checks.map((check) => (
          <div className="card" key={check.id}>
            <span>{check.label}</span>
            <strong>{check.status.toUpperCase()}</strong>

            <div className="controls">
              <button onClick={() => pass(check.id)}>PASS</button>
              <button onClick={() => fail(check.id)}>FAIL</button>
            </div>
          </div>
        ))}
      </div>

      <pre>{JSON.stringify(state, null, 2)}</pre>
    </section>
  );
}
