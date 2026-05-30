import { useMemo, useState } from "react";
import { createRealtimeSamplerEngine } from "../audio/realtimeSamplerEngine.js";
import { createLiveSequencerRecorder } from "../audio/liveSequencerRecorder.js";
import { createLiveMidiRouter } from "../audio/liveMidiRouter.js";
import { createRealtimeAutomationEngine } from "../audio/realtimeAutomationEngine.js";

export default function ProfessionalWorkstationPanel() {
  const sampler = useMemo(() => createRealtimeSamplerEngine(), []);
  const recorder = useMemo(() => createLiveSequencerRecorder(), []);
  const midi = useMemo(() => createLiveMidiRouter(), []);
  const automation = useMemo(() => createRealtimeAutomationEngine(), []);

  const [state, setState] = useState({
    sampler: sampler.snapshot(),
    recorder: recorder.snapshot(),
    midi: midi.snapshot(),
    automation: automation.snapshot(),
  });

  function refresh() {
    setState({
      sampler: sampler.snapshot(),
      recorder: recorder.snapshot(),
      midi: midi.snapshot(),
      automation: automation.snapshot(),
    });
  }

  function trigger(note) {
    const event = sampler.trigger(note, 120);

    midi.route({
      source: "sampler",
      target: "master",
      note,
    });

    recorder.capture({
      type: "note",
      note,
    });

    automation.automate("velocity", 120);

    refresh();

    return event;
  }

  function startRecording() {
    recorder.start();
    refresh();
  }

  function stopRecording() {
    recorder.stop();
    refresh();
  }

  function clearRecording() {
    recorder.clear();
    refresh();
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-black/30 p-4">
      <h2 className="mb-2 text-xl font-semibold text-white">
        Professional Workstation Panel
      </h2>

      <p className="mb-4 text-sm text-white/60">
        Sampler, sequencer recorder, MIDI routing, and automation runtime.
      </p>

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => trigger(36)}
          className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white"
        >
          Trigger Kick
        </button>

        <button
          onClick={() => trigger(38)}
          className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white"
        >
          Trigger Snare
        </button>

        <button
          onClick={startRecording}
          className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white"
        >
          Start Recording
        </button>

        <button
          onClick={stopRecording}
          className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white"
        >
          Stop Recording
        </button>

        <button
          onClick={clearRecording}
          className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white"
        >
          Clear Recording
        </button>
      </div>

      <pre className="max-h-[540px] overflow-auto rounded-xl bg-black/40 p-4 text-xs text-white/80">
        {JSON.stringify(state, null, 2)}
      </pre>
    </section>
  );
}
