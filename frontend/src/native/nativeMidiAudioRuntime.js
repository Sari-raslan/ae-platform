export function createNativeMidiAudioRuntime() {
  const state = {
    phase: "real-audio-real-midi-integration",
    midi: {
      supported: typeof navigator !== "undefined" && Boolean(navigator.requestMIDIAccess),
      connected: false,
      inputs: [],
      events: []
    },
    audio: {
      supported: typeof window !== "undefined" && Boolean(window.AudioContext || window.webkitAudioContext),
      active: false,
      sampleRate: null
    }
  };

  let audioContext = null;

  async function startAudio() {
    audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();

    if (audioContext.state === "suspended") {
      await audioContext.resume();
    }

    state.audio.active = true;
    state.audio.sampleRate = audioContext.sampleRate;

    return snapshot();
  }

  function tone(freq = 440, duration = 0.12) {
    if (!audioContext) return snapshot();

    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc.frequency.value = freq;
    osc.type = "triangle";

    gain.gain.setValueAtTime(0.2, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioContext.destination);

    osc.start();
    osc.stop(audioContext.currentTime + duration);

    return snapshot();
  }

  async function connectMidi() {
    if (!state.midi.supported) return snapshot();

    const access = await navigator.requestMIDIAccess();

    state.midi.connected = true;
    state.midi.inputs = [...access.inputs.values()].map((input) => input.name || input.id);

    for (const input of access.inputs.values()) {
      input.onmidimessage = (message) => {
        const [status, note, velocity] = message.data;
        const type = (status & 0xf0) === 0x90 && velocity > 0 ? "note-on" : "note-off";

        state.midi.events.unshift({
          type,
          note,
          velocity,
          receivedAt: new Date().toISOString()
        });

        state.midi.events = state.midi.events.slice(0, 32);

        if (type === "note-on") {
          tone(220 * Math.pow(2, (note - 57) / 12), Math.max(0.05, velocity / 600));
        }
      };
    }

    return snapshot();
  }

  function snapshot() {
    return {
      ok: true,
      ...state,
      generatedAt: new Date().toISOString()
    };
  }

  return {
    startAudio,
    tone,
    connectMidi,
    snapshot
  };
}
