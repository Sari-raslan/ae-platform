import { createWebAudioRuntime } from "./webAudioRuntime.js";
import { mapArrangerEventsToAudio } from "./arrangerEventAudioMapper.js";

export function createLiveArrangerAudioStream() {
  const audio = createWebAudioRuntime();
  const history = [];

  async function start() {
    return audio.start();
  }

  function renderEvents(events = []) {
    const mapped = mapArrangerEventsToAudio(events);

    for (const event of mapped) {
      audio.playTone({
        frequency: event.frequency,
        duration: event.duration,
        velocity: event.velocity,
      });

      history.push({
        ...event,
        playedAt: new Date().toISOString(),
      });
    }

    return snapshot();
  }

  function snapshot() {
    return {
      ok: true,
      audio: audio.snapshot(),
      history: history.slice(-50),
      playedCount: history.length,
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    start,
    renderEvents,
    snapshot,
  };
}
