export function createRealtimeGrooveEngine() {
  let state = {
    swing: 0,
    humanize: 0,
    groove: "straight",
  };

  function setSwing(value = 0) {
    state.swing = Math.max(0, Math.min(100, Number(value)));
    return snapshot();
  }

  function setHumanize(value = 0) {
    state.humanize = Math.max(0, Math.min(100, Number(value)));
    return snapshot();
  }

  function setGroove(groove = "straight") {
    state.groove = groove;
    return snapshot();
  }

  function apply(events = []) {
    return events.map((event, index) => {
      const swingOffset =
        state.swing > 0 && index % 2 === 1
          ? Math.round(state.swing / 10)
          : 0;

      const randomOffset =
        state.humanize > 0
          ? Math.round((Math.random() - 0.5) * state.humanize)
          : 0;

      return {
        ...event,
        grooveOffset: swingOffset + randomOffset,
        groove: state.groove,
      };
    });
  }

  function snapshot() {
    return {
      ok: true,
      ...state,
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    setSwing,
    setHumanize,
    setGroove,
    apply,
    snapshot,
  };
}
