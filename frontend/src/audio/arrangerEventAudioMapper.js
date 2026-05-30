export function midiNoteToFrequency(note = 60) {
  return 440 * Math.pow(2, (note - 69) / 12);
}

export function mapArrangerEventToAudio(event = {}) {
  return {
    ok: true,
    track: event.track || "ACC",
    note: event.note || 60,
    frequency: midiNoteToFrequency(event.note || 60),
    velocity: event.mixedVelocity || event.velocity || 100,
    duration: event.length ? Math.max(0.05, event.length * 0.08) : 0.12,
    channel: event.channel || 1,
  };
}

export function mapArrangerEventsToAudio(events = []) {
  return events.map(mapArrangerEventToAudio);
}
