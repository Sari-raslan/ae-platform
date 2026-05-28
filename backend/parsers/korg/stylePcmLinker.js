function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

export function linkStylesToPcm({
  styleBankCatalog = {},
  pcmFiles = [],
} = {}) {
  const pcmLookup = new Map();

  for (const pcm of pcmFiles) {
    const keys = [
      pcm.name,
      pcm.fileName,
      pcm.relativePath,
    ]
      .map(normalize)
      .filter(Boolean);

    for (const key of keys) {
      pcmLookup.set(key, pcm);
    }
  }

  const links = [];
  const unresolved = [];

  for (const [bankName, bank] of Object.entries(styleBankCatalog.banks || {})) {
    for (const [slotKey, slotInfo] of Object.entries(bank.slots || {})) {
      const entries = slotInfo.slotEntries || [];

      for (const entry of entries) {
        const references = entry.pcmReferences || entry.sampleReferences || [];

        for (const reference of references) {
          const key = normalize(reference);
          const pcm = pcmLookup.get(key);

          if (pcm) {
            links.push({
              style: {
                bank: bankName,
                slot: slotKey,
                fileName: entry.fileName,
                relativePath: entry.relativePath,
              },
              pcm: {
                fileName: pcm.fileName,
                relativePath: pcm.relativePath,
              },
              reference,
              confidence: "direct-name-match",
            });
          } else {
            unresolved.push({
              style: {
                bank: bankName,
                slot: slotKey,
                fileName: entry.fileName,
              },
              reference,
              reason: "pcm-not-found",
            });
          }
        }
      }
    }
  }

  return {
    linkCount: links.length,
    unresolvedCount: unresolved.length,
    links,
    unresolved,
  };
}
