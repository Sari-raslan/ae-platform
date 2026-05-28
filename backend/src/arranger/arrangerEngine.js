let engineState = {
  playing: false,
  selectedStyleId: null,
  tempo: 120,
  midiClock: false,
  splitPoint: "C4",
  routingProfile: "default",
  transport: "stopped",
  updatedAt: new Date().toISOString()
};

const routingProfiles = [
  { id: "default", name: "Default Local", input: "Local", output: "Internal Preview" },
  { id: "external-pa", name: "External PA Keyboard", input: "USB MIDI In", output: "USB MIDI Out" },
  { id: "studio", name: "Studio Routing", input: "DAW / Controller", output: "Virtual MIDI Bus" }
];

export function getEngineState() {
  return { ok: true, engine: engineState, routingProfiles };
}

export function updateEngineState(patch = {}) {
  engineState = { ...engineState, ...patch, updatedAt: new Date().toISOString() };
  return getEngineState();
}

export function startPreview(styleId, tempo) {
  return updateEngineState({
    playing: true,
    selectedStyleId: styleId || "oriental-pop",
    tempo: Number(tempo || engineState.tempo || 120),
    transport: "playing"
  });
}

export function stopPreview() {
  return updateEngineState({ playing: false, transport: "stopped" });
}

export function setTempo(tempo) {
  return updateEngineState({ tempo: Number(tempo || engineState.tempo || 120) });
}

export function setSplitPoint(splitPoint) {
  return updateEngineState({ splitPoint: splitPoint || engineState.splitPoint });
}

export function setRoutingProfile(routingProfile) {
  return updateEngineState({ routingProfile: routingProfile || engineState.routingProfile });
}

export function setMidiClock(enabled) {
  return updateEngineState({ midiClock: Boolean(enabled) });
}
