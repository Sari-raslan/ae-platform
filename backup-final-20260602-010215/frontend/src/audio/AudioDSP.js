export class AudioDSP {
  constructor() {
    this.context = null;

    this.masterGain = null;
    this.filter = null;
    this.compressor = null;
    this.delay = null;
    this.delayFeedback = null;
    this.reverb = null;
    this.limiter = null;

    this.voices = new Map();

    this.params = {
      masterVolume: 0.55,
      filterFreq: 9000,
      filterQ: 0.7,
      delayTime: 0.18,
      delayFeedback: 0.22,
      reverbMix: 0.15,
      waveform: "sawtooth"
    };
  }

  async start() {
    if (!this.context) {
      this.context = new AudioContext();

      this.masterGain = this.context.createGain();
      this.masterGain.gain.value = this.params.masterVolume;

      this.filter = this.context.createBiquadFilter();
      this.filter.type = "lowpass";
      this.filter.frequency.value = this.params.filterFreq;
      this.filter.Q.value = this.params.filterQ;

      this.compressor = this.context.createDynamicsCompressor();
      this.compressor.threshold.value = -18;
      this.compressor.knee.value = 24;
      this.compressor.ratio.value = 5;
      this.compressor.attack.value = 0.003;
      this.compressor.release.value = 0.25;

      this.delay = this.context.createDelay(1.0);
      this.delay.delayTime.value = this.params.delayTime;

      this.delayFeedback = this.context.createGain();
      this.delayFeedback.gain.value = this.params.delayFeedback;

      this.reverb = this.context.createConvolver();
      this.reverb.buffer = this.createImpulseResponse(1.8, 2.4);

      this.reverbGain = this.context.createGain();
      this.reverbGain.gain.value = this.params.reverbMix;

      this.limiter = this.context.createDynamicsCompressor();
      this.limiter.threshold.value = -3;
      this.limiter.knee.value = 0;
      this.limiter.ratio.value = 20;
      this.limiter.attack.value = 0.001;
      this.limiter.release.value = 0.05;

      this.masterGain.connect(this.filter);
      this.filter.connect(this.compressor);

      this.compressor.connect(this.delay);
      this.delay.connect(this.delayFeedback);
      this.delayFeedback.connect(this.delay);
      this.delay.connect(this.limiter);

      this.compressor.connect(this.reverb);
      this.reverb.connect(this.reverbGain);
      this.reverbGain.connect(this.limiter);

      this.compressor.connect(this.limiter);

      this.limiter.connect(this.context.destination);
    }

    if (this.context.state === "suspended") {
      await this.context.resume();
    }

    return this.status();
  }

  createImpulseResponse(seconds = 1.5, decay = 2.0) {
    const rate = this.context.sampleRate;
    const length = rate * seconds;
    const impulse = this.context.createBuffer(2, length, rate);

    for (let channel = 0; channel < 2; channel++) {
      const data = impulse.getChannelData(channel);

      for (let i = 0; i < length; i++) {
        data[i] =
          (Math.random() * 2 - 1) *
          Math.pow(1 - i / length, decay);
      }
    }

    return impulse;
  }

  noteToFreq(note) {
    return 440 * Math.pow(2, (note - 69) / 12);
  }

  noteOn(note, velocity = 100) {
    if (!this.context || !this.masterGain) return;

    this.noteOff(note);

    const id = String(note);
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();

    osc.type = this.params.waveform;
    osc.frequency.value = this.noteToFreq(note);

    const now = this.context.currentTime;
    const level = Math.max(0.02, Math.min(1, velocity / 127)) * 0.25;

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(level, now + 0.015);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);

    this.voices.set(id, {
      osc,
      gain,
      note
    });
  }

  noteOff(note) {
    if (!this.context) return;

    const id = String(note);
    const voice = this.voices.get(id);

    if (!voice) return;

    const now = this.context.currentTime;

    voice.gain.gain.cancelScheduledValues(now);
    voice.gain.gain.setValueAtTime(
      Math.max(voice.gain.gain.value, 0.0001),
      now
    );
    voice.gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

    voice.osc.stop(now + 0.1);

    this.voices.delete(id);
  }

  panic() {
    for (const key of Array.from(this.voices.keys())) {
      this.noteOff(Number(key));
    }
  }

  setParam(name, value) {
    const v = Number(value);
    this.params[name] = v;

    if (!this.context) return;

    if (name === "masterVolume") {
      this.masterGain.gain.value = v;
    }

    if (name === "filterFreq") {
      this.filter.frequency.value = v;
    }

    if (name === "filterQ") {
      this.filter.Q.value = v;
    }

    if (name === "delayTime") {
      this.delay.delayTime.value = v;
    }

    if (name === "delayFeedback") {
      this.delayFeedback.gain.value = v;
    }

    if (name === "reverbMix") {
      this.reverbGain.gain.value = v;
    }
  }

  setWaveform(type) {
    this.params.waveform = type;
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

export const audioDSP = new AudioDSP();
