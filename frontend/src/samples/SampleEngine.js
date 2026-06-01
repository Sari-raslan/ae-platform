export class SampleEngine {
  constructor() { this.samples = []; }
  addSample(name, path = "") {
    const sample = { name, path, createdAt: new Date().toISOString() };
    this.samples.push(sample);
    return sample;
  }
}
