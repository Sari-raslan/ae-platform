export class SampleEngine {
  constructor() {
    this.context = null;
    this.master = null;
    this.samples = [];
    this.volume = 0.7;
  }

  async start() {
    if (!this.context) {
      this.context = new AudioContext();
      this.master = this.context.createGain();
      this.master.gain.value = this.volume;
      this.master.connect(this.context.destination);
    }

    if (this.context.state === "suspended") {
      await this.context.resume();
    }

    return this.status();
  }

  async loadFile(file) {
    await this.start();

    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await this.context.decodeAudioData(arrayBuffer);

    const sample = {
      id: crypto.randomUUID(),
      name: file.name,
      duration: audioBuffer.duration,
      sampleRate: audioBuffer.sampleRate,
      channels: audioBuffer.numberOfChannels,
      buffer: audioBuffer,
      loadedAt: new Date().toISOString()
    };

    this.samples.push(sample);

    return sample;
  }

  play(id, options = {}) {
    if (!this.context || !this.master) return;

    const sample = this.samples.find((s) => s.id === id);
    if (!sample) return;

    const source = this.context.createBufferSource();
    const gain = this.context.createGain();

    source.buffer = sample.buffer;
    source.playbackRate.value = options.pitch || 1;

    gain.gain.value = options.volume ?? 1;

    source.connect(gain);
    gain.connect(this.master);

    source.start();

    return source;
  }

  remove(id) {
    this.samples = this.samples.filter((s) => s.id !== id);
  }

  setVolume(value) {
    this.volume = Number(value);
    if (this.master) {
      this.master.gain.value = this.volume;
    }
  }

  status() {
    return {
      state: this.context?.state || "not-started",
      sampleRate: this.context?.sampleRate || 0,
      volume: this.volume,
      samples: this.samples.map((s) => ({
        id: s.id,
        name: s.name,
        duration: s.duration,
        sampleRate: s.sampleRate,
        channels: s.channels,
        loadedAt: s.loadedAt
      }))
    };
  }
}

export const sampleEngine = new SampleEngine();
