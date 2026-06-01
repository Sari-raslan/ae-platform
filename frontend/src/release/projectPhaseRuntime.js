export function createProjectPhaseRuntime() {
  const phases = [
    { id: "v0.3", name: "MIDI Foundation", status: "implemented-or-in-progress" },
    { id: "v0.4", name: "Live Performance Runtime", status: "deployed" },
    { id: "v0.5", name: "Style Runtime", status: "implemented-or-ready" },
    { id: "v0.6", name: "Sample Engine", status: "implemented-or-ready" },
    { id: "v0.7", name: "PWA Runtime", status: "implemented-or-ready" },
    { id: "v0.8", name: "Audio Engine", status: "implemented-or-ready" },
    { id: "v0.9", name: "Desktop Packaging Preview", status: "preview-only" },
    { id: "v1.0", name: "Official Release", status: "not-yet" }
  ];

  const blockers = [
    "final build verification",
    "manual runtime test",
    "PWA install test",
    "sample loading test",
    "MIDI device test",
    "desktop packaging test",
    "release notes review"
  ];

  function snapshot() {
    return {
      ok: true,
      currentTrack: "stabilization-before-v0.9",
      releaseTarget: "v1.0.0-after-packaging",
      phases,
      blockers,
      readyForV1: false,
      generatedAt: new Date().toISOString()
    };
  }

  return { snapshot };
}
