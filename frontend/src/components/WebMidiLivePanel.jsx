import { useState } from "react";
import { decodeMidiMessage, requestWebMidiAccess } from "../midi/webMidiClient.js";

export default function WebMidiLivePanel() {
  const [state, setState] = useState({
    ok: false,
    connected: false,
    inputs: [],
    outputs: [],
    events: [],
    error: null,
  });

  async function connect() {
    try {
      const result = await requestWebMidiAccess();

      if (!result.ok) {
        setState((current) => ({
          ...current,
          ok: false,
          error: result.error,
        }));
        return;
      }

      for (const input of result.access.inputs.values()) {
        input.onmidimessage = (message) => {
          const decoded = decodeMidiMessage(message);
          setState((current) => ({
            ...current,
            events: [decoded, ...current.events].slice(0, 25),
          }));
        };
      }

      setState({
        ok: true,
        connected: true,
        inputs: result.inputs,
        outputs: result.outputs,
        events: [],
        error: null,
      });
    } catch (error) {
      setState((current) => ({
        ...current,
        ok: false,
        error: error.message,
      }));
    }
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-black/30 p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">Web MIDI Live</h2>
          <p className="text-sm text-white/60">
            Connect real MIDI devices and monitor incoming notes.
          </p>
        </div>
        <button
          onClick={connect}
          className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20"
        >
          Connect MIDI
        </button>
      </div>

      {state.error && (
        <div className="mb-3 rounded-xl bg-red-500/20 p-3 text-sm text-red-100">
          {state.error}
        </div>
      )}

      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-xl bg-white/5 p-3 text-white/80">
          Inputs: {state.inputs.length}
        </div>
        <div className="rounded-xl bg-white/5 p-3 text-white/80">
          Outputs: {state.outputs.length}
        </div>
        <div className="rounded-xl bg-white/5 p-3 text-white/80">
          Events: {state.events.length}
        </div>
      </div>

      <pre className="mt-4 max-h-[360px] overflow-auto rounded-xl bg-black/40 p-4 text-xs text-white/80">
        {JSON.stringify(
          {
            connected: state.connected,
            inputs: state.inputs,
            outputs: state.outputs,
            events: state.events,
          },
          null,
          2
        )}
      </pre>
    </section>
  );
}
