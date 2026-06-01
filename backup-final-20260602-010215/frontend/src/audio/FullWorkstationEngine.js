import { MixerEngine } from "../mixer/MixerEngine";

export class FullWorkstationEngine {
  constructor() {
    this.ctx = null;
    this.mixer = null;
    this.voices = new Map();
    this.samples = [];
    this.styleTimer = null;
    this.step = 0;
    this.tempo = 110;
    this.pattern = [48, 55, 60, 64, 67, 64, 60, 55];
  }

  async start() {
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.mixer = new MixerEngine(this.ctx).initialize(this.ctx.destination);
    }

    if (this.ctx.state === "suspended") {
      await this.ctx.resume();
    }

    return this.status();
  }

  freq(note) {
    return 440 * Math.pow(2, (note - 69) / 12);
  }

  noteOn(note, velocity = 100, channel = "lead") {
    if (!this.ctx || !this.mixer) return;

    this.noteOff(note, channel);

    const id = `${channel}:${note}`;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = channel === "bass" ? "square" : "sawtooth";
    osc.frequency.value = this.freq(note);

    const now = this.ctx.currentTime;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime((velocity / 127) * 0.25, now + 0.02);

    osc.connect(gain);
    gain.connect(this.mixer.getInput(channel));

    osc.start(now);

    this.voices.set(id, {
      osc,
      gain,
      note,
      channel
    });
  }

  noteOff(note, channel = "lead") {
    if (!this.ctx) return;

    const id = `${channel}:${note}`;
    const voice = this.voices.get(id);

    if (!voice) return;

    const now = this.ctx.currentTime;

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
    for (const voice of Array.from(this.voices.values())) {
      this.noteOff(voice.note, voice.channel);
    }
  }

  setTempo(v) {
    this.tempo = Number(v);
    if (this.styleTimer) this.startStyle();
  }

  startStyle() {
    this.stopStyle();

    const interval = 60000 / this.tempo / 2;

    this.styleTimer = setInterval(() => {
      const bassNote = this.pattern[this.step % this.pattern.length];
      const chordNote = bassNote + 12;

      this.noteOn(bassNote, 88, "bass");
      this.noteOn(chordNote, 62, "chord");

      setTimeout(() => {
        this.noteOff(bassNote, "bass");
        this.noteOff(chordNote, "chord");
      }, interval * 0.65);

      this.step++;
    }, interval);
  }

  stopStyle() {
    if (this.styleTimer) clearInterval(this.styleTimer);
    this.styleTimer = null;
    this.panic();
  }

  async loadSample(file) {
    await this.start();

    const arrayBuffer = await file.arrayBuffer();
    const buffer = await this.ctx.decodeAudioData(arrayBuffer);

    const sample = {
      id: crypto.randomUUID(),
      name: file.name,
      duration: buffer.duration,
      sampleRate: buffer.sampleRate,
      channels: buffer.numberOfChannels,
      buffer
    };

    this.samples.push(sample);

    return sample;
  }

  playSample(id, pitch = 1) {
    const sample = this.samples.find((s) => s.id === id);
    if (!sample || !this.ctx || !this.mixer) return;

    const source = this.ctx.createBufferSource();
    const gain = this.ctx.createGain();

    source.buffer = sample.buffer;
    source.playbackRate.value = pitch;
    gain.gain.value = 0.8;

    source.connect(gain);
    gain.connect(this.mixer.getInput("samples"));

    source.start();
  }

  removeSample(id) {
    this.samples = this.samples.filter((s) => s.id !== id);
  }

  setMixerVolume(channel, value) {
    this.mixer?.setVolume(channel, value);
  }

  setMixerMute(channel, value) {
    this.mixer?.setMute(channel, value);
  }

  setMixerSolo(channel, value) {
    this.mixer?.setSolo(channel, value);
  }

  exportProject() {
    return {
      version: "1.7.0",
      tempo: this.tempo,
      mixer: this.mixer?.status(),
      samples: this.samples.map((s) => ({
        name: s.name,
        duration: s.duration,
        sampleRate: s.sampleRate,
        channels: s.channels
      })),
      exportedAt: new Date().toISOString()
    };
  }

  importProject(data) {
    if (data?.tempo) {
      this.tempo = data.tempo;
    }

    if (data?.mixer?.channels) {
      data.mixer.channels.forEach((ch) => {
        this.mixer?.setVolume(ch.name, ch.volume);
        this.mixer?.setMute(ch.name, ch.muted);
        this.mixer?.setSolo(ch.name, ch.solo);
      });
    }
  }

  status() {
    return {
      audio: this.ctx?.state || "not-started",
      sampleRate: this.ctx?.sampleRate || 0,
      voices: this.voices.size,
      tempo: this.tempo,
      samples: this.samples.map((s) => ({
        id: s.id,
        name: s.name,
        duration: s.duration,
        sampleRate: s.sampleRate,
        channels: s.channels
      })),
      mixer: this.mixer?.status() || {
        master: 0,
        channels: []
      }
    };
  }
}

export const engine = new FullWorkstationEngine();
