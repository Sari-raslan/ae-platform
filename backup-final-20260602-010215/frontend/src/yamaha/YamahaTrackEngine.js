export class YamahaTrackEngine {

  constructor() {

    this.ctx = null;
    this.master = null;

    this.style = null;

    this.running = false;
    this.tempo = 112;

    this.step = 0;
    this.timer = null;

    this.section = "MAIN_A";
    this.chord = "C";

    this.listeners = [];

  }

  on(cb) {

    this.listeners.push(cb);

    return () => {
      this.listeners =
        this.listeners.filter(x => x !== cb);
    };

  }

  emit(type,data={}) {

    this.listeners.forEach(cb =>
      cb({
        type,
        data,
        time:new Date().toISOString()
      })
    );

  }

  async startAudio() {

    if (!this.ctx) {

      this.ctx = new AudioContext();

      this.master =
        this.ctx.createGain();

      this.master.gain.value = 0.5;

      this.master.connect(
        this.ctx.destination
      );

    }

    if (this.ctx.state === "suspended") {
      await this.ctx.resume();
    }

  }

  createFactoryStyle() {

    return {

      name:"Factory Yamaha Style",

      sections: {

        MAIN_A: {

          drums:[
            {note:36,step:0},
            {note:42,step:1},
            {note:38,step:2},
            {note:42,step:3},
            {note:36,step:4},
            {note:42,step:5},
            {note:38,step:6},
            {note:46,step:7}
          ],

          bass:[
            {note:36,step:0},
            {note:36,step:2},
            {note:43,step:4},
            {note:43,step:6}
          ],

          chord:[
            {note:48,step:0},
            {note:52,step:2},
            {note:55,step:4},
            {note:60,step:6}
          ]

        },

        MAIN_B: {

          drums:[
            {note:36,step:0},
            {note:42,step:1},
            {note:38,step:2},
            {note:46,step:3},
            {note:36,step:4},
            {note:42,step:5},
            {note:38,step:6},
            {note:49,step:7}
          ],

          bass:[
            {note:36,step:0},
            {note:43,step:2},
            {note:48,step:4},
            {note:55,step:6}
          ],

          chord:[
            {note:48,step:0},
            {note:55,step:2},
            {note:60,step:4},
            {note:64,step:6}
          ]

        }

      }

    };

  }

  async init() {

    await this.startAudio();

    this.style =
      this.createFactoryStyle();

    this.emit("style:loaded",{
      style:this.style.name
    });

  }

  freq(note) {

    return 440 * Math.pow(
      2,
      (note - 69) / 12
    );

  }

  transpose(note) {

    const roots = {
      C:0,
      Dm:2,
      Em:4,
      F:5,
      G:7,
      Am:9,
      B:11
    };

    return note + (roots[this.chord] || 0);

  }

  synth(
    note,
    type="sawtooth",
    duration=0.18,
    volume=0.12
  ) {

    if (!this.ctx) return;

    const osc =
      this.ctx.createOscillator();

    const gain =
      this.ctx.createGain();

    const now =
      this.ctx.currentTime;

    osc.type = type;

    osc.frequency.value =
      this.freq(note);

    gain.gain.setValueAtTime(
      volume,
      now
    );

    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      now + duration
    );

    osc.connect(gain);
    gain.connect(this.master);

    osc.start(now);
    osc.stop(now + duration);

  }

  playTracks() {

    if (!this.style) return;

    const sec =
      this.style.sections[this.section];

    if (!sec) return;

    sec.drums
      .filter(x => x.step === this.step)
      .forEach(ev => {

        this.synth(
          ev.note,
          "square",
          0.06,
          0.05
        );

      });

    sec.bass
      .filter(x => x.step === this.step)
      .forEach(ev => {

        this.synth(
          this.transpose(ev.note),
          "triangle",
          0.22,
          0.12
        );

      });

    sec.chord
      .filter(x => x.step === this.step)
      .forEach(ev => {

        this.synth(
          this.transpose(ev.note),
          "sawtooth",
          0.28,
          0.08
        );

      });

    this.emit("track:step",{
      section:this.section,
      chord:this.chord,
      step:this.step
    });

    this.step++;

    if (this.step >= 8) {
      this.step = 0;
    }

  }

  async start() {

    await this.init();

    this.stop(false);

    this.running = true;

    const interval =
      60000 / this.tempo / 2;

    this.timer =
      setInterval(
        () => this.playTracks(),
        interval
      );

    this.emit("engine:start",{
      tempo:this.tempo
    });

  }

  stop(emit=true) {

    if (this.timer) {
      clearInterval(this.timer);
    }

    this.timer = null;
    this.running = false;

    if (emit) {
      this.emit("engine:stop",{});
    }

  }

  setTempo(v) {

    this.tempo = Number(v);

    if (this.running) {
      this.start();
    }

  }

  setSection(section) {

    this.section = section;
    this.step = 0;

  }

  setChord(chord) {

    this.chord = chord;

  }

  status() {

    return {
      running:this.running,
      tempo:this.tempo,
      section:this.section,
      chord:this.chord,
      step:this.step,
      style:this.style?.name || "none"
    };

  }

}

export const yamahaTrackEngine =
  new YamahaTrackEngine();
