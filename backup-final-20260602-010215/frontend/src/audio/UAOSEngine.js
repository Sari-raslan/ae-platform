export class UAOSEngine {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.filter = null;

    this.voices = new Map();
    this.samples = [];

    this.tempo = 110;
    this.position = 0;

    this.running = false;
    this.recording = false;

    this.timer = null;

    this.pattern = [48,55,60,64,67,64,60,55];

    this.midiEvents = [];

    this.listeners = [];
  }

  on(cb) {
    this.listeners.push(cb);

    return () => {
      this.listeners = this.listeners.filter(x => x !== cb);
    };
  }

  emit(type, data = {}) {
    this.listeners.forEach(cb =>
      cb({
        type,
        data,
        time: new Date().toISOString()
      })
    );
  }

  async start() {
    if (!this.ctx) {
      this.ctx = new AudioContext();

      this.master = this.ctx.createGain();
      this.master.gain.value = 0.5;

      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = "lowpass";
      this.filter.frequency.value = 9000;

      this.master.connect(this.filter);
      this.filter.connect(this.ctx.destination);
    }

    if (this.ctx.state === "suspended") {
      await this.ctx.resume();
    }

    this.emit("engine:start", this.status());

    return this.status();
  }

  freq(note) {
    return 440 * Math.pow(2, (note - 69) / 12);
  }

  noteOn(note, velocity = 100) {
    if (!this.ctx) return;

    this.noteOff(note);

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.value = this.freq(note);

    const now = this.ctx.currentTime;

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(
      (velocity / 127) * 0.25,
      now + 0.02
    );

    osc.connect(gain);
    gain.connect(this.master);

    osc.start(now);

    this.voices.set(note, { osc, gain });

    if (this.recording) {
      this.midiEvents.push({
        type: "noteon",
        note,
        velocity,
        position: this.position
      });
    }
  }

  noteOff(note) {
    if (!this.ctx) return;

    const voice = this.voices.get(note);

    if (!voice) return;

    const now = this.ctx.currentTime;

    voice.gain.gain.cancelScheduledValues(now);
    voice.gain.gain.setValueAtTime(
      Math.max(voice.gain.gain.value, 0.0001),
      now
    );

    voice.gain.gain.exponentialRampToValueAtTime(
      0.0001,
      now + 0.08
    );

    voice.osc.stop(now + 0.1);

    this.voices.delete(note);

    if (this.recording) {
      this.midiEvents.push({
        type: "noteoff",
        note,
        position: this.position
      });
    }
  }

  panic() {
    Array.from(this.voices.keys()).forEach(n => this.noteOff(n));
  }

  setVolume(v) {
    if (this.master) {
      this.master.gain.value = Number(v);
    }
  }

  setFilter(v) {
    if (this.filter) {
      this.filter.frequency.value = Number(v);
    }
  }

  setTempo(v) {
    this.tempo = Number(v);

    if (this.running) {
      this.startArranger();
    }
  }

  startArranger() {
    this.stopArranger();

    const interval = 60000 / this.tempo / 2;

    this.running = true;

    this.timer = setInterval(() => {
      const note = this.pattern[this.position % this.pattern.length];

      this.noteOn(note, 88);

      setTimeout(() => {
        this.noteOff(note);
      }, interval * 0.6);

      this.position++;

      this.emit("arranger:step", this.status());

    }, interval);
  }

  stopArranger() {
    if (this.timer) clearInterval(this.timer);

    this.timer = null;
    this.running = false;

    this.panic();
  }

  startRecord() {
    this.recording = true;
    this.midiEvents = [];
    this.emit("record:start", {});
  }

  stopRecord() {
    this.recording = false;
    this.emit("record:stop", {
      events: this.midiEvents.length
    });
  }

  async loadSample(file) {
    await this.start();

    const arrayBuffer = await file.arrayBuffer();

    const buffer = await this.ctx.decodeAudioData(arrayBuffer);

    const sample = {
      id: crypto.randomUUID(),
      name: file.name,
      duration: buffer.duration,
      buffer
    };

    this.samples.push(sample);

    return sample;
  }

  playSample(id, pitch = 1) {
    if (!this.ctx) return;

    const sample = this.samples.find(s => s.id === id);

    if (!sample) return;

    const source = this.ctx.createBufferSource();
    const gain = this.ctx.createGain();

    source.buffer = sample.buffer;
    source.playbackRate.value = pitch;

    gain.gain.value = 0.8;

    source.connect(gain);
    gain.connect(this.master);

    source.start();
  }

  exportProject() {
    return {
      version: "2.0.0",
      tempo: this.tempo,
      midiEvents: this.midiEvents,
      samples: this.samples.map(s => ({
        name: s.name,
        duration: s.duration
      })),
      exportedAt: new Date().toISOString()
    };
  }

  status() {
    return {
      audio: this.ctx?.state || "not-started",
      sampleRate: this.ctx?.sampleRate || 0,
      voices: this.voices.size,
      tempo: this.tempo,
      position: this.position,
      running: this.running,
      recording: this.recording,
      samples: this.samples
    };
  }
}

export const uaos = new UAOSEngine();
