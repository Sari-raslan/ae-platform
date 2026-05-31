export function createKeyboardSplitEngine({ splitNote = 60 } = {}) {
  let state = {
    splitNote,
    leftHandNotes: [],
    rightHandNotes: [],
  };

  function feed(event = {}) {
    if (event.type !== "note-on" && event.type !== "note-off") {
      return snapshot();
    }

    const target =
      event.note < state.splitNote
        ? "leftHandNotes"
        : "rightHandNotes";

    if (event.type === "note-on") {
      state[target] = [...new Set([...state[target], event.note])].sort((a, b) => a - b);
    }

    if (event.type === "note-off") {
      state[target] = state[target].filter((note) => note !== event.note);
    }

    return snapshot();
  }

  function setSplitNote(note = 60) {
    state.splitNote = Number(note) || 60;
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
    feed,
    setSplitNote,
    snapshot,
  };
}
