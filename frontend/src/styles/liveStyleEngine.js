export function createLiveStyleEngine() {

  const styles = {
    POP: [220,330,440,330],
    DANCE: [330,440,550,660],
    BALLAD: [220,262,330,392],
  };

  let current = "POP";

  function setStyle(name) {
    if (styles[name]) {
      current = name;
    }

    return snapshot();
  }

  function notes() {
    return styles[current];
  }

  function snapshot() {
    return {
      current,
      notes: styles[current],
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    setStyle,
    notes,
    snapshot,
  };
}
