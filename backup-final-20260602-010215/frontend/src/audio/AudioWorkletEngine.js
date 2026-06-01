export class AudioWorkletEngine {
  constructor() {
    this.context = null;
    this.master = null;
    this.worklet = null;
    this.voices = new Map();

    this.params = {
      gain: 0.5,
      drive: 1.0,
      lowpass: 0.15,
      waveform: "sawtooth"
    };
  }

  async start() {
    if (!this.context) {
      this.context = new AudioContext();

      await this.context.audioWorklet.addModule("./worklets/uaos-dsp-processor.js");

      this.master = this.context.createGain();
      this.master.gain.value = 0.7;

      this.worklet = new AudioWorkletNode(
        this.context,
        "uaos-dsp-processor"
      );

      this.worklet.connect(this.master);
      this.master.connect(this.context.destination);

      this.sendParam("gain", this.params.gain);
      this.sendParam("drive", this.params.drive);
      this.sendParam("lowpass", this.params.lowpass);
    }

    if (this.context.state === "suspended") {
      await this.context.resume();
    }

    return this.status();
  }

  sendParam(type, value) {
    if (this.worklet) {
      this.worklet.port.postMessage({
        type,
        value
      });
    }
  }

  setParam(name, value) {
    this.params[name] = Number(value);
    this.sendParam(name, value);
  }

  setWaveform(type) {
    this.params.waveform = type;
  }

  freq(note) {
    return 440 * Math.pow(2, (note - 69) / 12);
  }

  noteOn(note, velocity = 100) {
    if (!this.context || !this.worklet) return;

    this.noteOff(note);

    const osc = this.context.createOscillator();
    const gain = this.context.createGain();

    osc.type = this.params.waveform;
    osc.frequency.value = this.freq(note);

    const now = this.context.currentTime;
    const level = Math.max(0.02, Math.min(1, velocity / 127)) * 0.35;

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(level, now + 0.015);

    osc.connect(gain);
    gain.connect(this.worklet);

    osc.start(now);

    this.voices.set(note, { osc, gain });
  }

  noteOff(note) {
    if (!this.context) return;

    const voice = this.voices.get(note);
    if (!voice) return;

    const now = this.context.currentTime;

    voice.gain.gain.cancelScheduledValues(now);
    voice.gain.gain.setValueAtTime(
      Math.max(voice.gain.gain.value, 0.0001),
      now
    );
    voice.gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

    voice.osc.stop(now + 0.1);
    this.voices.delete(note);
  }

  panic() {
    Array.from(this.voices.keys()).forEach((note) => this.noteOff(note));
  }

  status() {
    return {
      state: this.context?.state || "not-started",
      sampleRate: this.context?.sampleRate || 0,
      activeVoices: this.voices.size,
      ...this.params
    };
  }
}

export const audioWorkletEngine = new AudioWorkletEngine();
