export function mapMidiEventToRuntimeCommand(event = {}) {
  if (event.type === "note-on") {
    if (event.note === 60) return { type: "start", source: "midi-note-c4" };
    if (event.note === 61) return { type: "stop", source: "midi-note-csharp4" };
    if (event.note === 62) return { type: "status", source: "midi-note-d4" };

    return {
      type: "switch-style",
      styleId: `style-${Math.max(1, event.note - 59)}`,
      source: "midi-note-style-switch",
    };
  }

  if (event.type === "control-change") {
    return {
      type: "tempo",
      tempo: Math.max(60, Math.min(180, 60 + Number(event.value || 0))),
      source: "midi-cc-tempo",
    };
  }

  return {
    type: "status",
    source: "midi-fallback",
  };
}

export async function sendRuntimeCommand(command = {}) {
  const response = await fetch("/api/runtime/command", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
  });

  return response.json();
}
