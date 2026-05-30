export function createStyleSwitchingEngine(runtime = {}) {
  let activeStyle = null;
  const switchHistory = [];

  function listAvailableStyles() {
    return runtime.preload?.stylePreloadQueue || [];
  }

  function switchStyle(styleId) {
    const style = listAvailableStyles().find(
      (item) => item.id === styleId || item.name === styleId
    );

    if (!style) {
      throw new Error(`Cannot switch style. Style not found: ${styleId}`);
    }

    activeStyle = {
      ...style,
      active: true,
      switchedAt: new Date().toISOString(),
    };

    switchHistory.push(activeStyle);

    return activeStyle;
  }

  function getState() {
    return {
      ok: true,
      activeStyle,
      availableCount: listAvailableStyles().length,
      switchCount: switchHistory.length,
      switchHistory,
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    listAvailableStyles,
    switchStyle,
    getState,
  };
}
