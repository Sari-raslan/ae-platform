import { createRealtimeSequencedPlaybackLoop } from "../audio/realtimeSequencedPlaybackLoop.js";
import { createChordFollowEngine } from "../audio/chordFollowEngine.js";
import { createDynamicBassGenerator } from "../audio/dynamicBassGenerator.js";
import { createRealtimeGrooveEngine } from "../audio/realtimeGrooveEngine.js";
import { createVariationSwitchEngine } from "../audio/variationSwitchEngine.js";
import { createRealtimeFillEngine } from "../audio/realtimeFillEngine.js";
import { createRealtimeSamplerEngine } from "../audio/realtimeSamplerEngine.js";
import { createLiveMidiRouter } from "../audio/liveMidiRouter.js";
import { createRealtimeAutomationEngine } from "../audio/realtimeAutomationEngine.js";
import { createRegistrationMemorySystem } from "../audio/registrationMemorySystem.js";
import { createSongBookDatabase } from "../audio/songBookDatabase.js";
import { createLivePadPerformanceEngine } from "../audio/livePadPerformanceEngine.js";
import { createMasterMixerEngine } from "../audio/masterMixerEngine.js";

export function createFinalArrangerKernel() {
  const transport = createRealtimeSequencedPlaybackLoop({
    tempo: 120,
  });

  const chordEngine = createChordFollowEngine();
  const bassEngine = createDynamicBassGenerator();
  const groove = createRealtimeGrooveEngine();
  const variations = createVariationSwitchEngine();
  const fills = createRealtimeFillEngine();
  const sampler = createRealtimeSamplerEngine();
  const midi = createLiveMidiRouter();
  const automation = createRealtimeAutomationEngine();
  const registrations = createRegistrationMemorySystem();
  const songbook = createSongBookDatabase();
  const pads = createLivePadPerformanceEngine();
  const mixer = createMasterMixerEngine();

  let runtime = {
    running: false,
    chord: "C major",
    style: "POP-16BEAT",
    variation: "VAR1",
    renderedFrames: [],
    systemLoad: 0,
  };

  async function boot() {
    runtime.running = true;

    await transport.start();

    groove.setGroove("live");
    groove.setSwing(18);
    groove.setHumanize(12);

    return snapshot();
  }

  function shutdown() {
    runtime.running = false;
    transport.stop();

    return snapshot();
  }

  function setChord(notes = [60,64,67]) {
    const detected = chordEngine.feed(notes);

    runtime.chord = detected.chord || "C major";

    bassEngine.generate(runtime.chord);

    return snapshot();
  }

  function setVariation(name = "VAR1") {
    variations.queue(name);
    variations.apply();

    runtime.variation = name;

    return snapshot();
  }

  function triggerFill(name = "FILL1") {
    fills.trigger(name);
    return snapshot();
  }

  function triggerPad(name = "PAD1") {
    pads.trigger(name);

    midi.route({
      source: "pad",
      target: "sampler",
      pad: name,
    });

    return snapshot();
  }

  function playSample(note = 36) {
    sampler.trigger(note, 120);

    midi.route({
      source: "sampler",
      target: "master",
      note,
    });

    automation.automate("velocity", 120);

    return snapshot();
  }

  function saveRegistration() {
    registrations.save({
      name: "Realtime Live Setup",
      style: runtime.style,
      tempo: transport.snapshot().tempo,
      chord: runtime.chord,
      variation: runtime.variation,
    });

    return snapshot();
  }

  function pulse() {
    const frame = transport.pulse();

    runtime.renderedFrames.push({
      transport: frame.position,
      chord: runtime.chord,
      variation: runtime.variation,
      generatedAt: new Date().toISOString(),
    });

    runtime.renderedFrames =
      runtime.renderedFrames.slice(-256);

    runtime.systemLoad =
      Math.min(
        100,
        Math.round(
          25 +
          runtime.renderedFrames.length / 12
        )
      );

    return snapshot();
  }

  function snapshot() {
    return {
      ok: true,

      runtime,

      transport: transport.snapshot(),

      chordEngine: chordEngine.snapshot(),

      bassEngine: bassEngine.snapshot(),

      groove: groove.snapshot(),

      variations: variations.snapshot(),

      fills: fills.snapshot(),

      sampler: sampler.snapshot(),

      midi: midi.snapshot(),

      automation: automation.snapshot(),

      registrations: registrations.snapshot(),

      songbook: songbook.snapshot(),

      pads: pads.snapshot(),

      mixer: mixer.snapshot(),

      generatedAt: new Date().toISOString(),
    };
  }

  return {
    boot,
    shutdown,
    setChord,
    setVariation,
    triggerFill,
    triggerPad,
    playSample,
    saveRegistration,
    pulse,
    snapshot,
  };
}
