import { useMemo, useState } from "react";
import { createSongBookDatabase } from "../audio/songBookDatabase.js";
import { createRegistrationMemorySystem } from "../audio/registrationMemorySystem.js";
import { createLivePadPerformanceEngine } from "../audio/livePadPerformanceEngine.js";
import { createMasterMixerEngine } from "../audio/masterMixerEngine.js";

export default function WorkstationControlCenter() {
  const songbook = useMemo(() => createSongBookDatabase(), []);
  const registrations = useMemo(() => createRegistrationMemorySystem(), []);
  const pads = useMemo(() => createLivePadPerformanceEngine(), []);
  const mixer = useMemo(() => createMasterMixerEngine(), []);

  const [state, setState] = useState({
    songbook: songbook.snapshot(),
    registrations: registrations.snapshot(),
    pads: pads.snapshot(),
    mixer: mixer.snapshot(),
  });

  function refresh() {
    setState({
      songbook: songbook.snapshot(),
      registrations: registrations.snapshot(),
      pads: pads.snapshot(),
      mixer: mixer.snapshot(),
    });
  }

  function saveRegistration() {
    registrations.save({
      name: "Live Registration",
      style: "POP-16BEAT",
      tempo: 120,
      chord: "C major",
      variation: "VAR2",
    });

    refresh();
  }

  function triggerPad(name) {
    pads.trigger(name);
    refresh();
  }

  function volume(channel, value) {
    mixer.set(channel, value);
    refresh();
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-black/30 p-4">
      <h2 className="mb-2 text-xl font-semibold text-white">
        Workstation Control Center
      </h2>

      <p className="mb-4 text-sm text-white/60">
        SongBook, registrations, live pads, and mixer controls.
      </p>

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={saveRegistration}
          className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white"
        >
          Save Registration
        </button>

        <button
          onClick={() => triggerPad("PAD1")}
          className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white"
        >
          PAD1
        </button>

        <button
          onClick={() => triggerPad("PAD2")}
          className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white"
        >
          PAD2
        </button>

        <button
          onClick={() => triggerPad("PAD3")}
          className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white"
        >
          PAD3
        </button>

        <button
          onClick={() => triggerPad("PAD4")}
          className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white"
        >
          PAD4
        </button>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => volume("master", 127)}
          className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white"
        >
          Master 127
        </button>

        <button
          onClick={() => volume("drums", 110)}
          className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white"
        >
          Drums 110
        </button>

        <button
          onClick={() => volume("bass", 100)}
          className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white"
        >
          Bass 100
        </button>

        <button
          onClick={() => volume("acc", 90)}
          className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white"
        >
          ACC 90
        </button>
      </div>

      <pre className="max-h-[520px] overflow-auto rounded-xl bg-black/40 p-4 text-xs text-white/80">
        {JSON.stringify(state, null, 2)}
      </pre>
    </section>
  );
}
