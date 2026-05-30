import { useState } from "react";
import {
  mapMidiEventToRuntimeCommand,
  sendRuntimeCommand,
} from "../runtime/midiRuntimeCommandMapper.js";

const DEMO_EVENTS = [
  { type: "note-on", note: 60, velocity: 100 },
  { type: "note-on", note: 61, velocity: 100 },
  { type: "note-on", note: 62, velocity: 100 },
  { type: "note-on", note: 64, velocity: 100 },
  { type: "control-change", controller: 1, value: 70 },
];

export default function MidiRuntimeCommandSimulator() {
  const [log, setLog] = useState([]);

  async function run(event) {
    const command = mapMidiEventToRuntimeCommand(event);
    const result = await sendRuntimeCommand(command);

    setLog((current) => [
      {
        event,
        command,
        result,
        at: new Date().toISOString(),
      },
      ...current,
    ]);
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-black/30 p-4">
      <h2 className="mb-2 text-xl font-semibold text-white">
        MIDI Runtime Command Simulator
      </h2>

      <p className="mb-4 text-sm text-white/60">
        Simulates MIDI events and maps them to runtime commands.
      </p>

      <div className="mb-4 flex flex-wrap gap-2">
        {DEMO_EVENTS.map((event, index) => (
          <button
            key={index}
            onClick={() => run(event)}
            className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20"
          >
            {event.type} {event.note || event.controller}
          </button>
        ))}
      </div>

      <pre className="max-h-[420px] overflow-auto rounded-xl bg-black/40 p-4 text-xs text-white/80">
        {JSON.stringify(log, null, 2)}
      </pre>
    </section>
  );
}
