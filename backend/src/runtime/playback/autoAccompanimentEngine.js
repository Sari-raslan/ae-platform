import { recognizeChord } from "./chordRecognitionEngine.js";

export function createAutoAccompanimentEngine() {
  let state = {
    activeChord: null,
    notes: [],
  };

  function feedNotes(notes = []) {
    const chord = recognizeChord(notes);

    state.notes = notes;
    state.activeChord = chord.chord;

    return snapshot();
  }

  function snapshot() {
    return {
      ok: true,
      ...state,
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    feedNotes,
    snapshot,
  };
}
