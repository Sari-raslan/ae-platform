import { createKeyboardSplitEngine } from "./keyboardSplitEngine.js";
import { createLiveChordDetector } from "./liveChordDetector.js";

export function createLivePerformanceRuntime() {
  const split = createKeyboardSplitEngine({ splitNote: 60 });
  const chords = createLiveChordDetector();

  let state = {
    running: false,
    tempo: 120,
    transpose: 0,
    octave: 0,
    currentChord: null,
    lastEvent: null,
    performanceEvents: [],
  };

  function start() {
    state.running = true;
    return snapshot();
  }

  function stop() {
    state.running = false;
    return snapshot();
  }

  function feedMidi(event = {}) {
    state.lastEvent = event;

    const splitState = split.feed(event);
    const chordState = chords.feed(splitState.leftHandNotes);

    state.currentChord = chordState.detected.chord;

    state.performanceEvents.unshift({
      midi: event,
      leftHandNotes: splitState.leftHandNotes,
      rightHandNotes: splitState.rightHandNotes,
      chord: state.currentChord,
      at: new Date().toISOString(),
    });

    state.performanceEvents = state.performanceEvents.slice(0, 64);

    return snapshot();
  }

  function setTempo(value = 120) {
    state.tempo = Math.max(40, Math.min(240, Number(value) || 120));
    return snapshot();
  }

  function setTranspose(value = 0) {
    state.transpose = Math.max(-24, Math.min(24, Number(value) || 0));
    return snapshot();
  }

  function setOctave(value = 0) {
    state.octave = Math.max(-2, Math.min(2, Number(value) || 0));
    return snapshot();
  }

  function snapshot() {
    return {
      ok: true,
      ...state,
      split: split.snapshot(),
      chordDetector: chords.snapshot(),
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    start,
    stop,
    feedMidi,
    setTempo,
    setTranspose,
    setOctave,
    snapshot,
  };
}
