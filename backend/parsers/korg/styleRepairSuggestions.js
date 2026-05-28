function createSuggestion(type, severity, message, data = {}) {
  return {
    type,
    severity,
    message,
    data,
  };
}

export function generateStyleRepairSuggestions({
  styleSlotDiagnostics = {},
  pcmDependencyDiagnostics = {},
  songBookStyleLinks = {},
} = {}) {
  const suggestions = [];

  const conflicts =
    styleSlotDiagnostics.conflicts || [];

  for (const conflict of conflicts) {
    suggestions.push(
      createSuggestion(
        "style-slot-conflict",
        "high",
        `Resolve duplicate STYLE slot ${conflict.bank}:${conflict.slot}`,
        {
          bank: conflict.bank,
          slot: conflict.slot,
          files: conflict.files || [],
        }
      )
    );
  }

  const unresolvedPcm =
    pcmDependencyDiagnostics.missingByStyle || {};

  for (const [styleName, references] of Object.entries(unresolvedPcm)) {
    suggestions.push(
      createSuggestion(
        "missing-pcm",
        "medium",
        `Restore missing PCM references for ${styleName}`,
        {
          styleName,
          references,
        }
      )
    );
  }

  const unresolvedSongbook =
    songBookStyleLinks.unresolved || [];

  for (const unresolved of unresolvedSongbook) {
    suggestions.push(
      createSuggestion(
        "songbook-style-missing",
        "medium",
        "Repair SongBook STYLE reference",
        {
          song: unresolved.songBookEntry || {},
        }
      )
    );
  }

  return {
    suggestionCount: suggestions.length,
    suggestions,
  };
}
