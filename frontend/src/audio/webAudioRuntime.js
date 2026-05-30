export function createWebAudioRuntime() {
  let context = null;
  let masterGain = null;
  let started = false;

  async function start() {
    context = context || new AudioContext();
    masterGain = masterGain || context.createGain();
    masterGain.gain.value = 0.25;
    masterGain.connect(context.destination);

    if (context.state === "suspended") {
      await context.resume();
    }

    started = true;
    return snapshot();
  }

  function stop() {
    started = false;
    return snapshot();
  }

  function playTone({ frequency = 440, duration = 0.2, velocity = 100 } = {}) {
    if (!context || !masterGain) {
      throw new Error("Audio runtime not started");
    }

    const osc = context.createOscillator();
    const gain = context.createGain();

    osc.type = "sine";
    osc.frequency.value = frequency;
    gain.gain.value = Math.max(0, Math.min(1, velocity / 127));

    osc.connect(gain);
    gain.connect(masterGain);

    const now = context.currentTime;
    osc.start(now);
    osc.stop(now + duration);

    return {
      ok: true,
      frequency,
      duration,
      velocity,
      playedAt: new Date().toISOString(),
    };
  }

  function playMidiNote(note = 60, velocity = 100) {
    const frequency = 440 * Math.pow(2, (note - 69) / 12);
    return playTone({ frequency, velocity });
  }

  function snapshot() {
    return {
      ok: true,
      started,
      state: context?.state || "not-created",
      sampleRate: context?.sampleRate || null,
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    start,
    stop,
    playTone,
    playMidiNote,
    snapshot,
  };
}
