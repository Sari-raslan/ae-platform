export function createRuntimeQaChecklist() {
  const checks = [
    { id: "desktop-window", label: "Electron window opens", status: "pending" },
    { id: "audio-start", label: "START AUDIO works", status: "pending" },
    { id: "test-tones", label: "A3 / A4 / A5 tones work", status: "pending" },
    { id: "midi-connect", label: "CONNECT MIDI works", status: "pending" },
    { id: "midi-events", label: "MIDI note events appear", status: "pending" },
    { id: "style-runtime", label: "Style runtime switches", status: "pending" },
    { id: "sample-engine", label: "Sample engine loads WAV", status: "pending" },
    { id: "portable-exe", label: "Portable EXE opens", status: "pending" },
    { id: "installer-exe", label: "Installer EXE installs", status: "pending" }
  ];

  let state = {
    phase: "desktop-runtime-qa",
    checks,
    notes: [],
  };

  function pass(id) {
    state.checks = state.checks.map((check) =>
      check.id === id ? { ...check, status: "passed" } : check
    );
    return snapshot();
  }

  function fail(id) {
    state.checks = state.checks.map((check) =>
      check.id === id ? { ...check, status: "failed" } : check
    );
    return snapshot();
  }

  function reset() {
    state.checks = state.checks.map((check) => ({ ...check, status: "pending" }));
    state.notes = [];
    return snapshot();
  }

  function note(text) {
    state.notes.unshift({
      text,
      at: new Date().toISOString()
    });

    state.notes = state.notes.slice(0, 20);

    return snapshot();
  }

  function snapshot() {
    const passed = state.checks.filter((check) => check.status === "passed").length;
    const failed = state.checks.filter((check) => check.status === "failed").length;

    return {
      ok: true,
      phase: state.phase,
      passed,
      failed,
      total: state.checks.length,
      readyForRelease: passed === state.checks.length && failed === 0,
      checks: state.checks,
      notes: state.notes,
      generatedAt: new Date().toISOString()
    };
  }

  return {
    pass,
    fail,
    reset,
    note,
    snapshot
  };
}
