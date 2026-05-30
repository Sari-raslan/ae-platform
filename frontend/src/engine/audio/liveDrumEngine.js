export function createLiveDrumEngine(audio) {

  const kits = {
    STANDARD: [120,180,120,240],
    DANCE: [180,260,220,320],
    ARABIC: [140,160,210,280],
  };

  let currentKit = "STANDARD";

  function setKit(name) {
    if (kits[name]) {
      currentKit = name;
    }

    return snapshot();
  }

  function trigger(step = 0) {
    const pattern = kits[currentKit];

    const freq =
      pattern[
        step % pattern.length
      ];

    audio.beep(freq, 0.08);

    return freq;
  }

  function snapshot() {
    return {
      currentKit,
      pattern: kits[currentKit],
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    setKit,
    trigger,
    snapshot,
  };
}
