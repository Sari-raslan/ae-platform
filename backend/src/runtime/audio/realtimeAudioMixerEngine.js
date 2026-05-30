export function createRealtimeAudioMixerEngine() {
  const buses = {
    MASTER: { volume: 100 },
    DRUMS: { volume: 100 },
    BASS: { volume: 100 },
    ACC: { volume: 100 },
  };

  function setVolume(bus = "MASTER", volume = 100) {
    if (!buses[bus]) {
      buses[bus] = { volume: 100 };
    }

    buses[bus].volume = Math.max(0, Math.min(127, Number(volume)));

    return snapshot();
  }

  function apply(events = []) {
    return events.map((event) => {
      const bus =
        event.track === "DRUMS"
          ? "DRUMS"
          : event.track === "BASS"
          ? "BASS"
          : "ACC";

      const gain = (buses[bus]?.volume ?? 100) / 127;

      return {
        ...event,
        mixedVelocity: Math.round((event.velocity || 100) * gain),
      };
    });
  }

  function snapshot() {
    return {
      ok: true,
      buses,
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    setVolume,
    apply,
    snapshot,
  };
}
