import { createRuntimeMidiEventBus } from "./runtimeMidiEvents.js";
import { createStyleSwitchingEngine } from "./runtimeStyleSwitching.js";
import { createRuntimePerformanceMonitor } from "./runtimePerformanceMonitor.js";
import { createRuntimeCommandRouter } from "./runtimeCommandRouter.js";

export function createRealtimeArrangerEngine({ runtime = {} } = {}) {
  const midiBus = createRuntimeMidiEventBus();
  const styleSwitching = createStyleSwitchingEngine(runtime);
  const performance = createRuntimePerformanceMonitor();
  const commands = createRuntimeCommandRouter({ runtime });

  function start() {
    const state = commands.execute({ type: "play" });
    midiBus.emit("runtime-start", { state });
    performance.record({
      activeStyles: styleSwitching.getState().activeStyle ? 1 : 0,
      pcmCacheCount: runtime.preload?.pcmCacheCount || 0,
    });
    return getStatus();
  }

  function stop() {
    const state = commands.execute({ type: "stop" });
    midiBus.emit("runtime-stop", { state });
    performance.record({
      activeStyles: 0,
      pcmCacheCount: runtime.preload?.pcmCacheCount || 0,
    });
    return getStatus();
  }

  function switchStyle(styleId) {
    const style = styleSwitching.switchStyle(styleId);
    midiBus.emit("style-switch", { style });
    return getStatus();
  }

  function receiveMidi(message) {
    const event = midiBus.emit("midi-message", message);
    return {
      ok: true,
      event,
    };
  }

  function getStatus() {
    return {
      ok: true,
      mode: "realtime-arranger-engine",
      commandState: commands.execute({ type: "state" }),
      styleState: styleSwitching.getState(),
      midiEvents: midiBus.history(),
      performance: performance.summary(),
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    start,
    stop,
    switchStyle,
    receiveMidi,
    getStatus,
  };
}
