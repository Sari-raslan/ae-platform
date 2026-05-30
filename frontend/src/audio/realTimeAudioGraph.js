export function createRealTimeAudioGraph() {
  const context =
    typeof window !== "undefined"
      ? new (window.AudioContext || window.webkitAudioContext)()
      : null;

  let masterGain = null;

  if (context) {
    masterGain = context.createGain();
    masterGain.gain.value = 0.8;
    masterGain.connect(context.destination);
  }

  function beep(freq = 440, duration = 0.15) {
    if (!context) return;

    const osc = context.createOscillator();
    const gain = context.createGain();

    osc.frequency.value = freq;
    osc.type = "sawtooth";

    gain.gain.value = 0.12;

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start();

    setTimeout(() => {
      osc.stop();
    }, duration * 1000);
  }

  return {
    context,
    beep,
  };
}
