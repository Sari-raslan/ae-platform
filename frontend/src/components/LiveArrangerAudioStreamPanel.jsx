import { useMemo, useState } from "react";
import { createLiveArrangerAudioStream } from "../audio/liveArrangerAudioStream.js";

const DEMO_EVENTS = [
  { track: "DRUMS", note: 36, velocity: 120, channel: 10, length: 1 },
  { track: "DRUMS", note: 38, velocity: 110, channel: 10, length: 1 },
  { track: "BASS", note: 36, velocity: 105, channel: 2, length: 1 },
  { track: "ACC1", note: 60, velocity: 85, channel: 3, length: 1 },
  { track: "ACC1", note: 64, velocity: 85, channel: 3, length: 1 },
  { track: "ACC1", note: 67, velocity: 85, channel: 3, length: 1 },
];

export default function LiveArrangerAudioStreamPanel() {
  const stream = useMemo(() => createLiveArrangerAudioStream(), []);
  const [state, setState] = useState(stream.snapshot());
  const [error, setError] = useState(null);

  async function start() {
    try {
      await stream.start();
      setState(stream.snapshot());
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }

  function playDemo() {
    try {
      const next = stream.renderEvents(DEMO_EVENTS);
      setState(next);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-black/30 p-4">
      <h2 className="mb-2 text-xl font-semibold text-white">
        Live Arranger Audio Stream
      </h2>

      <p className="mb-4 text-sm text-white/60">
        Streams rendered arranger events into WebAudio.
      </p>

      <div className="mb-4 flex flex-wrap gap-2">
        <button onClick={start} className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white">
          Start Audio
        </button>

        <button onClick={playDemo} className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white">
          Play Demo Arranger Events
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-xl bg-red-500/20 p-3 text-sm text-red-100">
          {error}
        </div>
      )}

      <pre className="max-h-[420px] overflow-auto rounded-xl bg-black/40 p-4 text-xs text-white/80">
        {JSON.stringify(state, null, 2)}
      </pre>
    </section>
  );
}
