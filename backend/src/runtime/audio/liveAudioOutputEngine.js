import { createRealtimePcmStreamEngine } from "./realtimePcmStreamEngine.js";
import { createRealtimeAudioMixerEngine } from "./realtimeAudioMixerEngine.js";
import { createRealtimeMidiPlaybackEngine } from "./realtimeMidiPlaybackEngine.js";

export function createLiveAudioOutputEngine() {
  const pcm = createRealtimePcmStreamEngine();
  const mixer = createRealtimeAudioMixerEngine();
  const midi = createRealtimeMidiPlaybackEngine();

  function render(events = []) {
    const mixed = mixer.apply(events);

    for (const event of mixed) {
      pcm.stream({
        sample: `${event.track || "track"}-${event.note}.wav`,
        velocity: event.mixedVelocity,
        channel: event.channel || 1,
      });

      midi.send({
        type: "note-on",
        note: event.note,
        velocity: event.mixedVelocity,
        channel: event.channel || 1,
      });
    }

    return snapshot();
  }

  function snapshot() {
    return {
      ok: true,
      pcm: pcm.snapshot(),
      mixer: mixer.snapshot(),
      midi: midi.snapshot(),
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    render,
    snapshot,
  };
}
