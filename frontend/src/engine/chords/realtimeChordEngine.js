export function createRealtimeChordEngine() {

  let currentChord = "C Major";

  function detect(notes = []) {

    if (notes.includes("A")) {
      currentChord = "A Minor";
    } else if (notes.includes("G")) {
      currentChord = "G Major";
    } else {
      currentChord = "C Major";
    }

    return snapshot();
  }

  function snapshot() {
    return {
      currentChord,
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    detect,
    snapshot,
  };
}
