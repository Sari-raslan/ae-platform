import { runtimeBus } from "../runtime/runtimeBus";

export class AudioRuntime {
  constructor() {
    this.context = null;
    this.masterGain = null;
    this.compressor = null;
    this.started = false;
    this.activeVoices = new Map();
    this.masterVolume = 0.7;
    this.waveform = "sawtooth";
  }

  async start() {
    if (!this.context) {
      this.context = new AudioContext();

      this.masterGain = this.context.createGain();
      this.masterGain.gain.value = this.masterVolume;

      this.compressor = this.context.createDynamicsCompressor();
      this.compressor.threshold.value = -18;
      this.compressor.knee.value = 24;
      this.compressor.ratio.value = 6;
      this.compressor.attack.value = 0.003;
      this.compressor.release.value = 0.25;

      this.masterGain.connect(this.compressor);
      this.compressor.connect(this.context.destination);
    }

    if (this.context.state === "suspended") {
      await this.context.resume();
    }

    this.started = true;

    runtimeBus.emit("audio:ready", this.getStatus());
    return true;
  }

  setMasterVolume(value) {
    this.masterVolume = Math.max(0, Math.min(1, Number(value)));
    if (this.masterGain) this.masterGain.gain.value = this.masterVolume;
    runtimeBus.emit("audio:volume", { masterVolume: this.masterVolume });
  }

  setWaveform(type) {
    this.waveform = type;
    runtimeBus.emit("audio:waveform", { waveform: this.waveform });
  }

  noteToFrequency(note) {
    return 440 * Math.pow(2, (note - 69) / 12);
  }

  noteOn(note = 60, velocity = 100, channel = "main") {
    if (!this.context || !this.masterGain) return;

    const id = `${channel}:${note}`;
    if (this.activeVoices.has(id)) this.noteOff(note, channel);

    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    const filter = this.context.createBiquadFilter();

    osc.type = this.waveform;
    osc.frequency.value = this.noteToFrequency(note);

    filter.type = "lowpass";
    filter.frequency.value = 8500;
    filter.Q.value = 0.7;

    const now = this.context.currentTime;
    const level = Math.max(0.03, Math.min(1, velocity / 127)) * 0.18;

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(level, now + 0.015);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);

    this.activeVoices.set(id, { osc, gain, filter, note, channel });

    runtimeBus.emit("audio:noteon", {
      note,
      velocity,
      channel,
      frequency: osc.frequency.value,
      activeVoices: this.activeVoices.size
    });
  }

  noteOff(note = 60, channel = "main") {
    if (!this.context) return;

    const id = `${channel}:${note}`;
    const voice = this.activeVoices.get(id);
    if (!voice) return;

    const now = this.context.currentTime;

    voice.gain.gain.cancelScheduledValues(now);
    voice.gain.gain.setValueAtTime(Math.max(voice.gain.gain.value, 0.0001), now);
    voice.gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
    voice.osc.stop(now + 0.1);

    this.activeVoices.delete(id);

    runtimeBus.emit("audio:noteoff", {
      note,
      channel,
      activeVoices: this.activeVoices.size
    });
  }

  panic() {
    for (const voice of Array.from(this.activeVoices.values())) {
      this.noteOff(voice.note, voice.channel);
    }

    runtimeBus.emit("audio:panic", {
      activeVoices: this.activeVoices.size
    });
  }

  getStatus() {
    return {
      started: this.started,
      state: this.context?.state || "not-created",
      sampleRate: this.context?.sampleRate || 0,
      activeVoices: this.activeVoices.size,
      masterVolume: this.masterVolume,
      waveform: this.waveform
    };
  }
}

export const audioRuntime = new AudioRuntime();
