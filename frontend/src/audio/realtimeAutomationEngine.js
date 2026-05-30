export function createRealtimeAutomationEngine() {
  let lanes = [];

  function automate(parameter, value, step = 0) {
    const lane = {
      id: `automation-${lanes.length + 1}`,
      parameter,
      value,
      step,
      createdAt: new Date().toISOString(),
    };

    lanes.push(lane);
    lanes = lanes.slice(-256);

    return lane;
  }

  function snapshot() {
    return {
      ok: true,
      lanes,
      laneCount: lanes.length,
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    automate,
    snapshot,
  };
}
