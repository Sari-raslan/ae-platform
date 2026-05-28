// backend/parsers/korg/linkSourceMetadata.js

export function createStyleLink(style, source = "unknown", confidence = 0) {
  return {
    styleId: `${style.bank}:${style.slot}:${style.fileName}`,
    fileName: style.fileName,
    bank: style.bank,
    slot: style.slot,
    source, // "bank-slot", "exact-name", "fuzzy-name"
    confidence, // 0.0 - 1.0
    timestamp: new Date().toISOString(),
  };
}

export function createSongBookLink(songEntry, styleLink, quality = "unknown") {
  return {
    songId: songEntry.id || `${songEntry.title || "untitled"}:${Date.now()}`,
    title: songEntry.title || songEntry.name || "untitled",
    styleLink,
    quality, // "exact", "high", "medium", "low", "broken"
    requestedBank: songEntry.styleBank || songEntry.bank,
    requestedSlot: songEntry.styleSlot || songEntry.slot,
    requestedName: songEntry.styleName || songEntry.name,
    resolvedAt: new Date().toISOString(),
  };
}

export function summarizeLinkQuality(links = []) {
  const byQuality = {
    exact: 0,
    high: 0,
    medium: 0,
    low: 0,
    broken: 0,
  };

  for (const link of links) {
    const quality = link.quality || "broken";
    if (byQuality.hasOwnProperty(quality)) {
      byQuality[quality] += 1;
    }
  }

  const total = links.length;
  const resolved = total - (byQuality.broken || 0);

  return {
    total,
    resolved,
    unresolved: byQuality.broken,
    resolutionRate: total > 0 ? (resolved / total * 100).toFixed(1) : "0",
    breakdown: byQuality,
    averageConfidence: links.length > 0
      ? (links.reduce((sum, l) => sum + (l.styleLink?.confidence || 0), 0) / links.length).toFixed(3)
      : 0,
  };
}
