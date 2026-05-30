export function createStylePhraseEngine() {
  const phrases = {
    INTRO1: [
      { step: 0, track: "DRUMS", note: 36, velocity: 120 },
      { step: 6, track: "DRUMS", note: 42, velocity: 100 },
      { step: 12, track: "BASS", note: 36, velocity: 110 },
      { step: 18, track: "ACC1", note: 60, velocity: 90 },
    ],

    VAR1: [
      { step: 0, track: "DRUMS", note: 36, velocity: 120 },
      { step: 6, track: "DRUMS", note: 42, velocity: 95 },
      { step: 12, track: "DRUMS", note: 38, velocity: 110 },
      { step: 18, track: "DRUMS", note: 42, velocity: 95 },

      { step: 0, track: "BASS", note: 36, velocity: 105 },
      { step: 12, track: "BASS", note: 43, velocity: 100 },

      { step: 0, track: "ACC1", note: 60, velocity: 80 },
      { step: 12, track: "ACC1", note: 67, velocity: 80 },
    ],

    VAR2: [
      { step: 0, track: "DRUMS", note: 36, velocity: 127 },
      { step: 3, track: "DRUMS", note: 42, velocity: 100 },
      { step: 6, track: "DRUMS", note: 38, velocity: 120 },
      { step: 9, track: "DRUMS", note: 42, velocity: 100 },
      { step: 12, track: "DRUMS", note: 36, velocity: 127 },
      { step: 15, track: "DRUMS", note: 42, velocity: 100 },
      { step: 18, track: "DRUMS", note: 38, velocity: 120 },

      { step: 0, track: "BASS", note: 36, velocity: 110 },
      { step: 6, track: "BASS", note: 43, velocity: 105 },
      { step: 12, track: "BASS", note: 48, velocity: 110 },

      { step: 0, track: "ACC1", note: 60, velocity: 90 },
      { step: 6, track: "ACC1", note: 64, velocity: 90 },
      { step: 12, track: "ACC1", note: 67, velocity: 90 },
    ],

    ENDING1: [
      { step: 0, track: "DRUMS", note: 38, velocity: 120 },
      { step: 6, track: "DRUMS", note: 47, velocity: 127 },
      { step: 12, track: "ACC1", note: 72, velocity: 95 },
    ],
  };

  let current = "VAR1";

  function setPhrase(name = "VAR1") {
    current = phrases[name] ? name : "VAR1";
    return snapshot();
  }

  function getEvents(step = 0) {
    return (phrases[current] || []).filter((event) => event.step === step);
  }

  function snapshot() {
    return {
      ok: true,
      current,
      available: Object.keys(phrases),
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    setPhrase,
    getEvents,
    snapshot,
  };
}
