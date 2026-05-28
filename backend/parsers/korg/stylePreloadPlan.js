export function buildStylePreloadPlan({
  styleBankCatalog = {},
  songBookStyleLinks = {},
} = {}) {
  const preload = [];

  for (const link of songBookStyleLinks.links || []) {
    if (!link.style) continue;

    preload.push({
      type: "songbook-style",
      priority: "high",
      fileName: link.style.fileName,
      relativePath: link.style.relativePath,
      bank: link.style.bank,
      slot: link.style.slot,
    });
  }

  for (const [bankName, bank] of Object.entries(styleBankCatalog.banks || {})) {
    for (const [slotKey, slotInfo] of Object.entries(bank.slots || {})) {
      const primary = slotInfo.primaryEntry || slotInfo.slotEntries?.[0];
      if (!primary) continue;

      preload.push({
        type: "style-bank-slot",
        priority: "normal",
        fileName: primary.fileName,
        relativePath: primary.relativePath,
        bank: bankName,
        slot: slotKey,
      });
    }
  }

  return {
    preloadCount: preload.length,
    preload,
    generatedAt: new Date().toISOString(),
  };
}
