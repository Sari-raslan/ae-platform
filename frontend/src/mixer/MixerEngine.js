export class MixerEngine {
  constructor(audioContext) {
    this.context = audioContext;
    this.master = null;
    this.channels = {};
  }

  initialize(destination) {
    this.master = this.context.createGain();
    this.master.gain.value = 0.8;
    this.master.connect(destination);

    this.createChannel("drums");
    this.createChannel("bass");
    this.createChannel("chord");
    this.createChannel("lead");
    this.createChannel("samples");

    return this;
  }

  createChannel(name) {
    if (this.channels[name]) return this.channels[name];

    const gain = this.context.createGain();
    gain.gain.value = 0.8;
    gain.connect(this.master);

    this.channels[name] = {
      name,
      gain,
      volume: 0.8,
      muted: false,
      solo: false
    };

    return this.channels[name];
  }

  getInput(name) {
    return this.channels[name]?.gain || this.master;
  }

  setVolume(name, value) {
    const channel = this.channels[name];
    if (!channel) return;

    channel.volume = Number(value);
    channel.gain.gain.value = channel.muted ? 0 : channel.volume;
  }

  setMute(name, value) {
    const channel = this.channels[name];
    if (!channel) return;

    channel.muted = Boolean(value);
    channel.gain.gain.value = channel.muted ? 0 : channel.volume;
  }

  setSolo(name, value) {
    const channel = this.channels[name];
    if (!channel) return;

    channel.solo = Boolean(value);
    this.applySolo();
  }

  applySolo() {
    const anySolo = Object.values(this.channels).some((c) => c.solo);

    Object.values(this.channels).forEach((channel) => {
      if (anySolo) {
        channel.gain.gain.value = channel.solo ? channel.volume : 0;
      } else {
        channel.gain.gain.value = channel.muted ? 0 : channel.volume;
      }
    });
  }

  setMaster(value) {
    if (!this.master) return;
    this.master.gain.value = Number(value);
  }

  status() {
    return {
      master: this.master?.gain.value || 0,
      channels: Object.values(this.channels).map((c) => ({
        name: c.name,
        volume: c.volume,
        muted: c.muted,
        solo: c.solo
      }))
    };
  }
}
