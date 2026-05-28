// backend/parsers/korg/songBookLinkResolver.js

export function resolveConflictDeterministic(matches = [], strategy = "prefer-exact-bank-slot") {
  if (!matches || matches.length === 0) return null;
  if (matches.length === 1) return matches[0];

  // Sort by quality/confidence
  const sorted = [...matches].sort((a, b) => {
    const scoreA = calculateResolutionScore(a, strategy);
    const scoreB = calculateResolutionScore(b, strategy);
    return scoreB - scoreA; // Descending
  });

  return sorted[0];
}

function calculateResolutionScore(match, strategy) {
  let score = 0;

  // Base on source type
  if (match.source === "bank-slot") score += 100;
  else if (match.source === "exact-name") score += 80;
  else if (match.source === "fuzzy-name") score += 40;
  else score += 10;

  // Bonus for confidence
  score += (match.confidence || 0) * 20;

  // Strategy-specific adjustments
  if (strategy === "prefer-exact-bank-slot" && match.source === "bank-slot") {
    score += 50;
  } else if (strategy === "prefer-primary-entry" && match.isPrimary) {
    score += 30;
  }

  return score;
}

export function findConflictingMatches(requestedBank, requestedSlot, styleCatalog = {}) {
  const conflicts = [];
  const banks = styleCatalog.banks || {};

  for (const [bankName, bank] of Object.entries(banks)) {
    for (const [slotKey, slotData] of Object.entries(bank.slots || {})) {
      if (slotData.duplicates && slotData.duplicates.length > 0) {
        conflicts.push({
          bank: bankName,
          slot: parseInt(slotKey),
          duplicateCount: slotData.duplicates.length,
          entries: slotData.slotEntries || [],
        });
      }
    }
  }

  return conflicts;
}

export function resolveDuplicateStyleSlots(styleCatalog = {}, strategy = "keep-primary") {
  const conflicts = findConflictingMatches(null, null, styleCatalog);
  const resolutions = [];

  for (const conflict of conflicts) {
    let winner = null;

    if (strategy === "keep-primary") {
      winner = conflict.entries[0];
    } else if (strategy === "keep-largest") {
      winner = conflict.entries.reduce((max, e) =>
        (e.size || 0) > (max.size || 0) ? e : max
      );
    } else if (strategy === "keep-most-recent") {
      winner = conflict.entries.reduce((max, e) =>
        (e.modifiedAt || "") > (max.modifiedAt || "") ? e : max
      );
    }

    resolutions.push({
      bank: conflict.bank,
      slot: conflict.slot,
      strategy,
      winner: winner?.fileName,
      losers: conflict.entries
        .filter((e) => e !== winner)
        .map((e) => e.fileName),
    });
  }

  return {
    strategy,
    conflictCount: conflicts.length,
    resolutions,
  };
}

export function buildLinkResolutionMap(songs = [], styleCatalog = {}, nameNormalizer = null) {
  const resolutionMap = {};

  for (const song of songs) {
    const bank = song.styleBank || song.bank;
    const slot = song.styleSlot || song.slot;
    const name = song.styleName || song.name;

    const key = `${song.id || song.title}`;

    // Try bank+slot first (exact match)
    if (bank && slot) {
      const bankData = styleCatalog.banks?.[bank];
      const slotData = bankData?.slots?.[String(slot)];

      if (slotData?.primaryEntry) {
        resolutionMap[key] = {
          source: "bank-slot",
          confidence: 1.0,
          style: slotData.primaryEntry,
          alternatives: slotData.slotEntries
            ? slotData.slotEntries.filter((e) => e !== slotData.primaryEntry)
            : [],
        };
        continue;
      }
    }

    // Fall back to name matching
    if (name && nameNormalizer) {
      const match = nameNormalizer.findBest?.(name, styleCatalog);
      if (match) {
        resolutionMap[key] = {
          source: "fuzzy-name",
          confidence: match.score || 0.7,
          style: match.style,
          alternatives: [],
        };
        continue;
      }
    }

    // Unresolved
    resolutionMap[key] = {
      source: "unresolved",
      confidence: 0,
      style: null,
      alternatives: [],
    };
  }

  return resolutionMap;
}
