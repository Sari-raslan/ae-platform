import { createTransportClock } from "./transportClock.js";
import { createStyleScheduler } from "./styleScheduler.js";
import { createStyleEventScheduler } from "./styleEventScheduler.js";
import { createPcmSampleScheduler } from "./pcmSampleScheduler.js";

export function createRealtimeArrangerEngine() {
  const clock = createTransportClock({ ppq: 24 });
  const style = createStyleScheduler();
  const events = createStyleEventScheduler();
  const pcm = createPcmSampleScheduler();

  let arranger = {
    activeStyle: "style-1",
    activeVariation: "VAR1",
    activeChord: "C",
    currentStep: 0,
  };

  function bootstrapDemoPattern() {
    events.queue({
      track: "DRUMS",
      note: 36,
      velocity: 120,
      step: 0,
    });

    events.queue({
      track: "DRUMS",
      note: 38,
      velocity: 112,
      step: 12,
    });

    events.queue({
      track: "DRUMS",
      note: 42,
      velocity: 100,
      step: 6,
    });

    events.queue({
      track: "DRUMS",
      note: 42,
      velocity: 100,
      step: 18,
    });
  }

  bootstrapDemoPattern();

  function snapshot() {
    return {
      ok: true,
      arranger,
      clock: clock.snapshot(),
      scheduler: style.snapshot(),
      events: events.snapshot(),
      pcm: pcm.snapshot(),
      generatedAt: new Date().toISOString(),
    };
  }

  function start(styleId = arranger.activeStyle) {
    arranger.activeStyle = styleId;
    clock.start();
    return snapshot();
  }

  function stop() {
    clock.stop();
    arranger.currentStep = 0;
    return snapshot();
  }

  function queueVariation(variation = "VAR1") {
    style.schedule({
      type: "variation",
      value: variation,
      applyAt: "next-bar",
    });

    return snapshot();
  }

  function pulse(ticks = 1) {
    const state = clock.pulse(ticks);

    arranger.currentStep = state.tick;

    const dueEvents = events.collect(state.tick);

    for (const event of dueEvents) {
      pcm.trigger({
        sample: `${event.track.toLowerCase()}-${event.note}.wav`,
        velocity: event.velocity,
        frame: state.tick,
      });
    }

    if (state.barBoundary) {
      const ready = style.flushAtBarBoundary();

      for (const item of ready.applied) {
        if (item.type === "variation") {
          arranger.activeVariation = item.value;
        }
      }
    }

    return snapshot();
  }

  return {
    snapshot,
    start,
    stop,
    pulse,
    queueVariation,
  };
}
