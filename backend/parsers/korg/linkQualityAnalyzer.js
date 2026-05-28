// backend/parsers/korg/linkQualityAnalyzer.js

export function analyzeOrphans(songs = [], links = []) {
  const linkedSongIds = new Set(links.map((l) => l.songId));
  const unlinkedSongs = songs.filter((s) => !linkedSongIds.has(s.id || `${s.title}:${s.id || "unknown"}`));

  return {
    unlinkedCount: unlinkedSongs.length,
    unlinkedSongs: unlinkedSongs.map((s) => ({
      id: s.id || `${s.title}:unknown`,
      title: s.title || "untitled",
      requestedBank: s.styleBank || s.bank,
      requestedSlot: s.styleSlot || s.slot,
      requestedName: s.styleName || s.name,
    })),
  };
}

export function analyzeUnusedStyles(styles = [], links = []) {
  const usedStyleIds = new Set(links.map((l) => l.styleLink?.styleId));
  const unusedStyles = styles.filter((s) => {
    const styleId = `${s.bank}:${s.slot}:${s.fileName}`;
    return !usedStyleIds.has(styleId);
  });

  return {
    unusedCount: unusedStyles.length,
    unusedStyles: unusedStyles.map((s) => ({
      styleId: `${s.bank}:${s.slot}:${s.fileName}`,
      fileName: s.fileName,
      bank: s.bank,
      slot: s.slot,
      size: s.size,
    })),
  };
}

export function analyzeBrokenReferences(links = []) {
  const broken = links.filter((l) => l.quality === "broken" || !l.styleLink);

  return {
    brokenCount: broken.length,
    brokenReferences: broken.map((l) => ({
      songId: l.songId,
      title: l.title,
      requestedBank: l.requestedBank,
      requestedSlot: l.requestedSlot,
      requestedName: l.requestedName,
      reason: l.brokenReason || "style-not-found",
    })),
  };
}

export function analyzeAmbiguities(links = []) {
  const ambiguous = links.filter((l) => l.quality === "medium" || l.quality === "low");

  return {
    ambiguousCount: ambiguous.length,
    ambiguities: ambiguous.map((l) => ({
      songId: l.songId,
      title: l.title,
      resolvedStyle: {
        fileName: l.styleLink?.fileName,
        bank: l.styleLink?.bank,
        slot: l.styleLink?.slot,
      },
      confidence: l.styleLink?.confidence,
      source: l.styleLink?.source,
      alternatives: l.alternatives || [], // Could contain other matches
    })),
  };
}

export function generateLinkQualityReport(songs = [], styles = [], links = []) {
  const orphans = analyzeOrphans(songs, links);
  const unused = analyzeUnusedStyles(styles, links);
  const broken = analyzeBrokenReferences(links);
  const ambiguous = analyzeAmbiguities(links);

  const healthScore = links.length > 0
    ? ((links.filter((l) => l.quality === "exact" || l.quality === "high").length / links.length) * 100).toFixed(1)
    : 0;

  return {
    timestamp: new Date().toISOString(),
    summary: {
      totalSongs: songs.length,
      totalStyles: styles.length,
      totalLinks: links.length,
      healthScore: `${healthScore}%`,
    },
    issues: {
      orphanedSongs: orphans.unlinkedCount,
      unusedStyles: unused.unusedCount,
      brokenReferences: broken.brokenCount,
      ambiguousLinks: ambiguous.ambiguousCount,
    },
    details: {
      orphans,
      unused,
      broken,
      ambiguous,
    },
  };
}
