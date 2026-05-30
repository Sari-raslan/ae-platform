export function createLiveArrangerRuntime({
  setName = "Unknown SET",
  styles = [],
  pcm = [],
  songBook = [],
  midi = {},
} = {}) {
  const stylePreloadQueue = styles.map((style, index) => ({
    id: `style-${index + 1}`,
    name: style.name || style.fileName || `Style ${index + 1}`,
    bank: style.bank || null,
    slot: style.slot || null,
    status: "queued",
    priority: index === 0 ? "high" : "normal",
  }));

  const pcmPreloadCache = pcm.map((sample, index) => ({
    id: `pcm-${index + 1}`,
    name: sample.name || sample.fileName || `PCM ${index + 1}`,
    path: sample.path || sample.relativePath || null,
    status: "ready",
  }));

  const songBookRuntimeMap = songBook.map((entry, index) => ({
    id: entry.id || `songbook-${index + 1}`,
    title: entry.title || entry.name || `SongBook ${index + 1}`,
    linkedStyle: entry.linkedStyle || null,
    status: entry.linkedStyle ? "linked" : "unlinked",
  }));

  return {
    ok: true,
    mode: "live-arranger-runtime",
    setName,
    transport: {
      state: "stopped",
      tempo: 120,
      clock: midi.clock || "internal",
      position: {
        bar: 1,
        beat: 1,
        tick: 0,
      },
    },
    midiRouting: {
      input: midi.input || "default-input",
      output: midi.output || "default-output",
      channel: midi.channel || 1,
      enabled: true,
    },
    preload: {
      styleQueueCount: stylePreloadQueue.length,
      pcmCacheCount: pcmPreloadCache.length,
      stylePreloadQueue,
      pcmPreloadCache,
    },
    songBookRuntimeMap,
    health: {
      status: "experimental-ready",
      warnings: songBookRuntimeMap.filter((item) => item.status === "unlinked").length,
      missingPcm: 0,
      styleConflicts: 0,
    },
    nextActions: [
      "connect real parsed styles",
      "connect real PCM dependency map",
      "connect MIDI device state",
      "add play/stop runtime commands",
      "add realtime style preview",
    ],
    generatedAt: new Date().toISOString(),
  };
}
