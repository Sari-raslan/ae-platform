export class MidiRecorder {
  constructor() {
    this.recording = false;
    this.playing = false;

    this.startTime = 0;
    this.events = [];

    this.listeners = [];
    this.playTimer = null;
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

  startRecord() {
    this.recording = true;
    this.events = [];
    this.startTime = performance.now();

    this.emit("record:start", {});
  }

  stopRecord() {
    this.recording = false;

    this.emit("record:stop", {
      total: this.events.length
    });
  }

  noteOn(note, velocity = 100) {

    if (!this.recording) return;

    this.events.push({
      type: "noteOn",
      note,
      velocity,
      time: performance.now() - this.startTime
    });

    this.emit("record:event", {
      note,
      velocity
    });

  }

  noteOff(note) {

    if (!this.recording) return;

    this.events.push({
      type: "noteOff",
      note,
      time: performance.now() - this.startTime
    });

  }

  play(playFn) {

    if (this.playing) return;

    this.playing = true;

    this.emit("play:start", {});

    this.events.forEach(event => {

      setTimeout(() => {

        if (!this.playing) return;

        playFn(event);

      }, event.time);

    });

    const total =
      Math.max(
        0,
        ...this.events.map(e => e.time)
      ) + 1000;

    this.playTimer = setTimeout(() => {

      this.stopPlay();

    }, total);

  }

  stopPlay() {

    this.playing = false;

    if (this.playTimer) {
      clearTimeout(this.playTimer);
    }

    this.emit("play:stop", {});

  }

  clear() {

    this.events = [];

    this.emit("record:clear", {});

  }

  exportJSON() {

    return {
      version: "4.3.0",
      exportedAt: new Date().toISOString(),
      events: this.events
    };

  }

  status() {

    return {
      recording: this.recording,
      playing: this.playing,
      totalEvents: this.events.length
    };

  }
}

export const midiRecorder = new MidiRecorder();
