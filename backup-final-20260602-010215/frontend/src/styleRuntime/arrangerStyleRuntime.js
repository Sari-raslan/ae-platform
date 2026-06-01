import { createStyleSectionRuntime } from "./styleSectionRuntime.js";
import { transposeStyleEvents } from "./styleTransposer.js";

export function createArrangerStyleRuntime() {
  const sections = createStyleSectionRuntime();

  let state = {
    running: false,
    chord: "C major",
    bar: 1,
    beat: 1,
    step: 0,
    stepsPerBar: 16,
    renderedEvents: []
  };

  function start() {
    state.running = true;
    return snapshot();
  }

  function stop() {
    state.running = false;
    return snapshot();
  }

  function setChord(chord = "C major") {
    state.chord = chord;
    return snapshot();
  }

  function queueSection(section = "VAR1") {
    sections.queueSection(section);
    return snapshot();
  }

  function pulse() {
    if (!state.running) return snapshot();

    const rawEvents = sections.eventsAtStep(state.step);
    const rendered = transposeStyleEvents(rawEvents, state.chord);

    if (rendered.length > 0) {
      state.renderedEvents.unshift({
        bar: state.bar,
        beat: state.beat,
        step: state.step,
        chord: state.chord,
        events: rendered,
        renderedAt: new Date().toISOString()
      });

      state.renderedEvents = state.renderedEvents.slice(0, 64);
    }

    state.step += 1;

    if (state.step >= state.stepsPerBar) {
      state.step = 0;
      state.bar += 1;
      sections.applyQueuedSection();
    }

    state.beat = Math.floor(state.step / 4) + 1;

    return snapshot();
  }

  function snapshot() {
    return {
      ok: true,
      ...state,
      section: sections.snapshot(),
      generatedAt: new Date().toISOString()
    };
  }

  return {
    start,
    stop,
    pulse,
    setChord,
    queueSection,
    snapshot
  };
}
