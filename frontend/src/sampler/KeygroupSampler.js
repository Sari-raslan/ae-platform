export class KeygroupSampler {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.keygroups = [];
    this.activeSources = [];
  }

  async start() {
    if (!this.ctx) {
      this.ctx = new AudioContext();

      this.master = this.ctx.createGain();
      this.master.gain.value = 0.75;
      this.master.connect(this.ctx.destination);
    }

    if (this.ctx.state === "suspended") {
      await this.ctx.resume();
    }

    return this.status();
  }

  async loadSampleFile(file, config = {}) {
    await this.start();

    const arrayBuffer = await file.arrayBuffer();
    const buffer = await this.ctx.decodeAudioData(arrayBuffer);

    const keygroup = {
      id: crypto.randomUUID(),
      name: file.name,
      rootNote: Number(config.rootNote ?? 60),
      lowNote: Number(config.lowNote ?? 0),
      highNote: Number(config.highNote ?? 127),
      lowVelocity: Number(config.lowVelocity ?? 1),
      highVelocity: Number(config.highVelocity ?? 127),
      volume: Number(config.volume ?? 1),
      buffer,
      duration: buffer.duration,
      sampleRate: buffer.sampleRate,
      channels: buffer.numberOfChannels,
      loadedAt: new Date().toISOString()
    };

    this.keygroups.push(keygroup);

    return keygroup;
  }

  findKeygroup(note, velocity) {
    return this.keygroups.find((kg) =>
      note >= kg.lowNote &&
      note <= kg.highNote &&
      velocity >= kg.lowVelocity &&
      velocity <= kg.highVelocity
    );
  }

  play(note, velocity = 100) {
    if (!this.ctx || !this.master) return;

    const kg = this.findKeygroup(note, velocity);
    if (!kg) return null;

    const source = this.ctx.createBufferSource();
    const gain = this.ctx.createGain();

    const semitoneOffset = note - kg.rootNote;
    source.playbackRate.value = Math.pow(2, semitoneOffset / 12);

    source.buffer = kg.buffer;

    const velocityGain = Math.max(0.05, velocity / 127);
    gain.gain.value = kg.volume * velocityGain;

    source.connect(gain);
    gain.connect(this.master);

    source.start();

    const active = {
      id: crypto.randomUUID(),
      note,
      velocity,
      keygroupId: kg.id,
      source
    };

    this.activeSources.push(active);

    source.onended = () => {
      this.activeSources = this.activeSources.filter((x) => x.id !== active.id);
    };

    return active;
  }

  stopAll() {
    this.activeSources.forEach((s) => {
      try {
        s.source.stop();
      } catch {}
    });

    this.activeSources = [];
  }

  removeKeygroup(id) {
    this.keygroups = this.keygroups.filter((kg) => kg.id !== id);
  }

  updateKeygroup(id, patch) {
    const kg = this.keygroups.find((x) => x.id === id);
    if (!kg) return;

    Object.assign(kg, {
      ...patch,
      rootNote: Number(patch.rootNote ?? kg.rootNote),
      lowNote: Number(patch.lowNote ?? kg.lowNote),
      highNote: Number(patch.highNote ?? kg.highNote),
      lowVelocity: Number(patch.lowVelocity ?? kg.lowVelocity),
      highVelocity: Number(patch.highVelocity ?? kg.highVelocity),
      volume: Number(patch.volume ?? kg.volume)
    });
  }

  exportMap() {
    return {
      version: "3.3.0",
      exportedAt: new Date().toISOString(),
      keygroups: this.keygroups.map((kg) => ({
        name: kg.name,
        rootNote: kg.rootNote,
        lowNote: kg.lowNote,
        highNote: kg.highNote,
        lowVelocity: kg.lowVelocity,
        highVelocity: kg.highVelocity,
        volume: kg.volume,
        duration: kg.duration,
        sampleRate: kg.sampleRate,
        channels: kg.channels
      }))
    };
  }

  setMasterVolume(value) {
    if (this.master) {
      this.master.gain.value = Number(value);
    }
  }

  status() {
    return {
      state: this.ctx?.state || "not-started",
      sampleRate: this.ctx?.sampleRate || 0,
      masterVolume: this.master?.gain.value || 0,
      activeSources: this.activeSources.length,
      keygroups: this.keygroups.map((kg) => ({
        id: kg.id,
        name: kg.name,
        rootNote: kg.rootNote,
        lowNote: kg.lowNote,
        highNote: kg.highNote,
        lowVelocity: kg.lowVelocity,
        highVelocity: kg.highVelocity,
        volume: kg.volume,
        duration: kg.duration,
        sampleRate: kg.sampleRate,
        channels: kg.channels
      }))
    };
  }
}

export const keygroupSampler = new KeygroupSampler();
