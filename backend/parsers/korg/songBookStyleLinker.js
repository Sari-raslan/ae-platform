// backend/parsers/korg/songBookStyleLinker.js

function normalizeText(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function buildStyleLookup(styleBankCatalog = {}) {
  const byBankSlot = new Map();
  const byName = new Map();

  for (const [bankName, bank] of Object.entries(styleBankCatalog.banks || {})) {
    for (const [slotKey, slotInfo] of Object.entries(bank.slots || {})) {
      const entries = slotInfo.slotEntries || [slotInfo.primaryEntry].filter(Boolean);

      for (const entry of entries) {
        const key = `${bankName}:${slotKey}`;
        byBankSlot.set(key, entry);

        const nameKey = normalizeText(entry.name || entry.fileName);
        if (nameKey) byName.set(nameKey, entry);
      }
    }
  }

  return { byBankSlot, byName };
}

export function linkSongBookToStyles(songBookEntries = [], styleBankCatalog = {}) {
  const lookup = buildStyleLookup(styleBankCatalog);
  const links = [];
  const unresolved = [];

  for (const song of songBookEntries) {
    const bank = song.styleBank || song.bank || null;
    const slot = song.styleSlot || song.slot || null;
    const name = song.styleName || song.name || null;

    let match = null;
    let method = "none";

    if (bank && slot) {
      match = lookup.byBankSlot.get(`${bank}:${slot}`);
      method = match ? "bank-slot" : method;
    }

    if (!match && name) {
      match = lookup.byName.get(normalizeText(name));
      method = match ? "name" : method;
    }

    if (match) {
      links.push({
        songBookEntry: song,
        style: match,
        method,
        confidence: method === "bank-slot" ? "high" : "medium",
      });
    } else {
      unresolved.push({
        songBookEntry: song,
        reason: "style-reference-not-found",
      });
    }
  }

  return {
    linkCount: links.length,
    unresolvedCount: unresolved.length,
    links,
    unresolved,
  };
}

export function summarizeSongBookStyleLinks(linkResult = {}) {
  return {
    totalSongs: linkResult.linkCount + linkResult.unresolvedCount,
    linkedSongs: linkResult.linkCount,
    unlinkedSongs: linkResult.unresolvedCount,
    linkResolutionRate: linkResult.linkCount + linkResult.unresolvedCount > 0
      ? Number((
          (linkResult.linkCount / (linkResult.linkCount + linkResult.unresolvedCount)) * 100
        ).toFixed(1))
      : 0,
    methodBreakdown: {
      bankSlot: linkResult.links.filter((l) => l.method === "bank-slot").length,
      name: linkResult.links.filter((l) => l.method === "name").length,
    },
  };
}

export function formatSongBookStyleReport(linkResult = {}) {
  const summary = summarizeSongBookStyleLinks(linkResult);

  return {
    title: "Song Book STYLE Linking Report",
    timestamp: new Date().toISOString(),
    summary,
    report: {
      totalSongs: summary.totalSongs,
      successfulLinks: summary.linkedSongs,
      failedLinks: summary.unlinkedSongs,
      resolutionRate: `${summary.linkResolutionRate}%`,
      methodBreakdown: summary.methodBreakdown,
      message:
        summary.unlinkedSongs > 0
          ? `${summary.unlinkedSongs} song(s) could not be linked to STYLE references`
          : `All ${summary.linkedSongs} songs successfully linked to STYLE references`,
    },
    details: {
      linked: linkResult.links.map((l) => ({
        song: l.songBookEntry.title || l.songBookEntry.name || "untitled",
        styleFile: l.style.fileName,
        bank: l.style.bank,
        slot: l.style.slot,
        method: l.method,
        confidence: l.confidence,
      })),
      unlinked: linkResult.unresolved.map((u) => ({
        song: u.songBookEntry.title || u.songBookEntry.name || "untitled",
        requestedBank: u.songBookEntry.bank || u.songBookEntry.styleBank,
        requestedSlot: u.songBookEntry.slot || u.songBookEntry.styleSlot,
        requestedName: u.songBookEntry.name || u.songBookEntry.styleName,
        reason: u.reason,
      })),
    },
  };
}
