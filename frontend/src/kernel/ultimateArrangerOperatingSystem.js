import { createFinalArrangerKernel } from "./finalArrangerKernel.js";
import { createRealtimeGrooveEngine } from "../audio/realtimeGrooveEngine.js";
import { createRealtimeSamplerEngine } from "../audio/realtimeSamplerEngine.js";
import { createLiveMidiRouter } from "../audio/liveMidiRouter.js";
import { createMasterMixerEngine } from "../audio/masterMixerEngine.js";

export function createUltimateArrangerOperatingSystem() {
  const kernel = createFinalArrangerKernel();

  const groove = createRealtimeGrooveEngine();

  const sampler = createRealtimeSamplerEngine();

  const midi = createLiveMidiRouter();

  const mixer = createMasterMixerEngine();

  let system = {
    booted: false,
    cpuLoad: 0,
    audioLatency: 4,
    polyphony: 128,
    realtimeFrames: 0,
    engineMode: "ULTIMATE-LIVE",
  };

  async function boot() {
    await kernel.boot();

    groove.setGroove("ultimate-live");
    groove.setSwing(24);
    groove.setHumanize(18);

    system.booted = true;

    return snapshot();
  }

  function shutdown() {
    kernel.shutdown();

    system.booted = false;

    return snapshot();
  }

  function realtimeCycle() {
    kernel.pulse();

    system.realtimeFrames += 1;

    system.cpuLoad =
      Math.min(
        100,
        Math.round(
          35 +
          system.realtimeFrames / 6
        )
      );

    return snapshot();
  }

  function performChord(notes = [60,64,67]) {
    kernel.setChord(notes);

    return snapshot();
  }

  function switchVariation(name = "VAR1") {
    kernel.setVariation(name);

    return snapshot();
  }

  function triggerRealtimeFill(name = "FILL1") {
    kernel.triggerFill(name);

    return snapshot();
  }

  function triggerLivePad(name = "PAD1") {
    kernel.triggerPad(name);

    return snapshot();
  }

  function triggerRealtimeSample(note = 36) {
    sampler.trigger(note, 120);

    midi.route({
      source: "ultimate-kernel",
      target: "master-output",
      note,
    });

    return snapshot();
  }

  function setMixer(channel, value) {
    mixer.set(channel, value);

    return snapshot();
  }

  function saveRealtimeRegistration() {
    kernel.saveRegistration();

    return snapshot();
  }

  function snapshot() {
    return {
      ok: true,

      system,

      groove: groove.snapshot(),

      sampler: sampler.snapshot(),

      midi: midi.snapshot(),

      mixer: mixer.snapshot(),

      kernel: kernel.snapshot(),

      generatedAt: new Date().toISOString(),
    };
  }

  return {
    boot,
    shutdown,
    realtimeCycle,
    performChord,
    switchVariation,
    triggerRealtimeFill,
    triggerLivePad,
    triggerRealtimeSample,
    setMixer,
    saveRealtimeRegistration,
    snapshot,
  };
}
