import { createStylePhraseEngine } from "./stylePhraseEngine.js";
import { transposeToChord } from "./liveChordTransposer.js";
import { createRealtimeSequencedPlaybackLoop } from "./realtimeSequencedPlaybackLoop.js";

export function createLivePerformanceScheduler() {
  const phrases = createStylePhraseEngine();
  const loop = createRealtimeSequencedPlaybackLoop({
    tempo: 120,
  });

  let state = {
    chord: "C major",
    section: "VAR1",
    rendered: [],
  };

  async function start() {
    await loop.start();
    return snapshot();
  }

  function stop() {
    loop.stop();
    return snapshot();
  }

  function setChord(chord = "C major") {
    state.chord = chord;
    return snapshot();
  }

  function setSection(section = "VAR1") {
    phrases.setPhrase(section);
    state.section = section;
    return snapshot();
  }

  function pulse() {
    const transport = loop.pulse();

    const step = transport.position.step;

    const events = phrases.getEvents(step);

    const rendered = transposeToChord(events, state.chord);

    state.rendered.push({
      step,
      chord: state.chord,
      section: state.section,
      events: rendered,
      renderedAt: new Date().toISOString(),
    });

    state.rendered = state.rendered.slice(-64);

    return snapshot();
  }

  function snapshot() {
    return {
      ok: true,
      transport: loop.snapshot(),
      phrases: phrases.snapshot(),
      ...state,
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    start,
    stop,
    pulse,
    setChord,
    setSection,
    snapshot,
  };
}
