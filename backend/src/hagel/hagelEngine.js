export function detectMediaType(fileName = "") {
  const ext = fileName.split(".").pop().toLowerCase();
  if (["mid", "midi"].includes(ext)) return "MIDI";
  if (["wav", "mp3", "flac", "aiff", "ogg", "m4a"].includes(ext)) return "AUDIO";
  if (["syx"].includes(ext)) return "SYSEX";
  return "UNKNOWN";
}

export function analyzeMedia({ fileName, size = 0 }) {
  const type = detectMediaType(fileName);
  const suggestions = [];

  if (type === "MIDI") {
    suggestions.push("Quantize timing", "Fix note overlaps", "Normalize velocity", "Remove accidental notes");
  }

  if (type === "AUDIO") {
    suggestions.push("Noise reduction", "Normalize loudness", "Trim silence", "Detect clipping");
  }

  if (type === "SYSEX") {
    suggestions.push("Validate SysEx blocks", "Check F0/F7 boundaries", "Detect manufacturer byte");
  }

  return {
    ok: true,
    product: "Hagel Audio Manager",
    type,
    fileName,
    size,
    suggestions,
    note: "Repair-planning foundation. Deep DSP processing comes later."
  };
}

export function quantizeMidiPlan({ grid = "1/16", strength = 100 }) {
  return {
    ok: true,
    operation: "MIDI_QUANTIZE_PLAN",
    grid,
    strength,
    actions: ["read events", "detect note pairs", "snap timing", "preserve lengths", "non-destructive export"]
  };
}

export function audioCleanupPlan({ noiseReduction = true, normalize = true }) {
  return {
    ok: true,
    operation: "AUDIO_CLEANUP_PLAN",
    noiseReduction,
    normalize,
    actions: ["analyze waveform", "detect silence", "detect clipping", "estimate noise floor"]
  };
}
