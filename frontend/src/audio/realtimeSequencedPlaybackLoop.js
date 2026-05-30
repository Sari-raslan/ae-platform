import { createLiveArrangerAudioStream } from "./liveArrangerAudioStream.js";

const DEMO_PATTERN = [
  { step: 0, track: "DRUMS", note: 36, velocity: 120, channel: 10, length: 1 },
  { step: 6, track: "DRUMS", note: 42, velocity: 90, channel: 10, length: 1 },
  { step: 12, track: "DRUMS", note: 38, velocity: 112, channel: 10, length: 1 },
  { step: 18, track: "DRUMS", note: 42, velocity: 90, channel: 10, length: 1 },
  { step: 0, track: "BASS", note: 36, velocity: 105, channel: 2, length: 1 },
  { step: 12, track: "BASS", note: 36, velocity: 100, channel: 2, length: 1 },
  { step: 0, track: "ACC1", note: 60, velocity: 80, channel: 3, length: 1 },
  { step: 12, track: "ACC1", note: 67, velocity: 80, channel: 3, length: 1 },
];

export function createRealtimeSequencedPlaybackLoop({
  tempo = 120,
  ppq = 24,
  stepsPerBar = 24,
} = {}) {
  const stream = createLiveArrangerAudioStream();

  let timer = null;
  let running = false;
  let step = 0;
  let bar = 1;
  let beat = 1;
  let tick = 0;
  let playedEvents = [];

  function intervalMs() {
    return Math.max(10, Math.round(60000 / tempo / ppq));
  }

  async function start() {
    await stream.start();

    if (timer) clearInterval(timer);

    running = true;

    timer = setInterval(() => {
      pulse();
    }, intervalMs());

    return snapshot();
  }

  function stop() {
    running = false;

    if (timer) {
      clearInterval(timer);
      timer = null;
    }

    return snapshot();
  }

  function reset() {
    step = 0;
    bar = 1;
    beat = 1;
    tick = 0;
    playedEvents = [];

    return snapshot();
  }

  function setTempo(value) {
    tempo = Math.max(40, Math.min(240, Number(value) || 120));

    if (running) {
      clearInterval(timer);
      timer = setInterval(() => {
        pulse();
      }, intervalMs());
    }

    return snapshot();
  }

  function pulse() {
    const due = DEMO_PATTERN.filter((event) => event.step === step);

    if (due.length > 0) {
      stream.renderEvents(due);

      playedEvents.push(
        ...due.map((event) => ({
          ...event,
          bar,
          beat,
          tick,
          playedAt: new Date().toISOString(),
        }))
      );

      playedEvents = playedEvents.slice(-100);
    }

    tick += 1;
    step = (step + 1) % stepsPerBar;

    if (tick >= ppq) {
      tick = 0;
      beat += 1;
    }

    if (beat > 4) {
      beat = 1;
      bar += 1;
    }

    return snapshot();
  }

  function snapshot() {
    return {
      ok: true,
      running,
      tempo,
      ppq,
      stepsPerBar,
      position: {
        bar,
        beat,
        tick,
        step,
      },
      playedEvents,
      audio: stream.snapshot(),
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    start,
    stop,
    reset,
    setTempo,
    pulse,
    snapshot,
  };
}
