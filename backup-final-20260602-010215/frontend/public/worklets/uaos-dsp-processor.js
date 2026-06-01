class UAOSDSPProcessor extends AudioWorkletProcessor {
  constructor() {
    super();

    this.gain = 0.5;
    this.drive = 1.0;
    this.lowpass = 0.15;
    this.lastL = 0;
    this.lastR = 0;

    this.port.onmessage = (event) => {
      const { type, value } = event.data || {};

      if (type === "gain") this.gain = Number(value);
      if (type === "drive") this.drive = Number(value);
      if (type === "lowpass") this.lowpass = Number(value);
    };
  }

  process(inputs, outputs) {
    const input = inputs[0];
    const output = outputs[0];

    if (!output || output.length === 0) return true;

    const outL = output[0];
    const outR = output[1] || output[0];

    const inL = input?.[0] || outL;
    const inR = input?.[1] || inL;

    for (let i = 0; i < outL.length; i++) {
      let l = inL[i] || 0;
      let r = inR[i] || 0;

      l = Math.tanh(l * this.drive);
      r = Math.tanh(r * this.drive);

      this.lastL = this.lastL + this.lowpass * (l - this.lastL);
      this.lastR = this.lastR + this.lowpass * (r - this.lastR);

      outL[i] = this.lastL * this.gain;
      outR[i] = this.lastR * this.gain;
    }

    return true;
  }
}

registerProcessor("uaos-dsp-processor", UAOSDSPProcessor);
