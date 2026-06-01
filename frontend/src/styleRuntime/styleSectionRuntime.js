export function createStyleSectionRuntime() {
  const sections = {
    INTRO1: [
      { step: 0, track: "DRUMS", note: 36, velocity: 120 },
      { step: 4, track: "DRUMS", note: 42, velocity: 90 },
      { step: 8, track: "BASS", note: 36, velocity: 105 },
      { step: 12, track: "ACC1", note: 60, velocity: 80 }
    ],
    VAR1: [
      { step: 0, track: "DRUMS", note: 36, velocity: 120 },
      { step: 4, track: "DRUMS", note: 42, velocity: 90 },
      { step: 8, track: "DRUMS", note: 38, velocity: 112 },
      { step: 12, track: "DRUMS", note: 42, velocity: 90 },
      { step: 0, track: "BASS", note: 36, velocity: 105 },
      { step: 8, track: "BASS", note: 43, velocity: 95 },
      { step: 0, track: "ACC1", note: 60, velocity: 80 },
      { step: 8, track: "ACC1", note: 67, velocity: 80 }
    ],
    VAR2: [
      { step: 0, track: "DRUMS", note: 36, velocity: 127 },
      { step: 2, track: "DRUMS", note: 42, velocity: 90 },
      { step: 4, track: "DRUMS", note: 38, velocity: 118 },
      { step: 6, track: "DRUMS", note: 42, velocity: 90 },
      { step: 8, track: "DRUMS", note: 36, velocity: 127 },
      { step: 12, track: "DRUMS", note: 38, velocity: 118 },
      { step: 0, track: "BASS", note: 36, velocity: 110 },
      { step: 4, track: "BASS", note: 43, velocity: 100 },
      { step: 8, track: "BASS", note: 48, velocity: 108 },
      { step: 0, track: "ACC1", note: 60, velocity: 88 },
      { step: 4, track: "ACC1", note: 64, velocity: 88 },
      { step: 8, track: "ACC1", note: 67, velocity: 88 }
    ],
    FILL1: [
      { step: 0, track: "DRUMS", note: 38, velocity: 120 },
      { step: 2, track: "DRUMS", note: 42, velocity: 95 },
      { step: 4, track: "DRUMS", note: 45, velocity: 118 },
      { step: 6, track: "DRUMS", note: 47, velocity: 127 }
    ],
    ENDING1: [
      { step: 0, track: "DRUMS", note: 38, velocity: 120 },
      { step: 4, track: "BASS", note: 36, velocity: 110 },
      { step: 8, track: "ACC1", note: 72, velocity: 95 }
    ]
  };

  let currentSection = "VAR1";
  let queuedSection = null;

  function queueSection(section = "VAR1") {
    if (sections[section]) queuedSection = section;
    return snapshot();
  }

  function applyQueuedSection() {
    if (queuedSection) {
      currentSection = queuedSection;
      queuedSection = null;
    }
    return snapshot();
  }

  function eventsAtStep(step = 0) {
    return (sections[currentSection] || []).filter((event) => event.step === step);
  }

  function snapshot() {
    return {
      ok: true,
      currentSection,
      queuedSection,
      availableSections: Object.keys(sections),
      generatedAt: new Date().toISOString()
    };
  }

  return {
    queueSection,
    applyQueuedSection,
    eventsAtStep,
    snapshot
  };
}
