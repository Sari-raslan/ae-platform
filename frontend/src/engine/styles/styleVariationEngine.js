export function createStyleVariationEngine() {

  let variation = "VAR1";

  function setVariation(name) {
    variation = name;
    return snapshot();
  }

  function snapshot() {
    return {
      variation,
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    setVariation,
    snapshot,
  };
}
