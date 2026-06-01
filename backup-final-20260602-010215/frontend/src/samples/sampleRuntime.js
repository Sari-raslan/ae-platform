import { runtimeBus } from "../runtime/runtimeBus";

export class SampleRuntime {
  constructor() {
    this.samples = [];
  }

  addSample(name = "Empty Sample Slot", path = "") {
    const sample = {
      id: crypto.randomUUID(),
      name,
      path,
      loaded: false,
      createdAt: new Date().toISOString()
    };

    this.samples.push(sample);
    runtimeBus.emit("sample:add", sample);

    return sample;
  }

  removeSample(id) {
    this.samples = this.samples.filter((s) => s.id !== id);
    runtimeBus.emit("sample:remove", { id });
  }

  getSamples() {
    return this.samples;
  }
}

export const sampleRuntime = new SampleRuntime();
