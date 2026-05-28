function toSlotNumber(value) {
  const slot = Number(value);
  if (!Number.isInteger(slot)) return null;
  if (slot < 1 || slot > 999) return null;
  return slot;
}

function analyzeStyleSlotDiagnostics(catalog, options = {}) {
  const maxSlot = options.maxSlot || 999;

  if (!catalog || !catalog.banks) {
    return {
      conflicts: [],
      missingSlotsByBank: {},
      diagnostics: [
        {
          type: "style-slot-diagnostics",
          level: "warn",
          message: "STYLE slot diagnostics skipped: missing catalog",
        },
      ],
    };
  }

  const conflicts = [];
  const missingSlotsByBank = {};

  for (const [bankName, bank] of Object.entries(catalog.banks)) {
    const seen = new Map();
    const occupiedSlots = new Set();

    for (const [slotKey, entry] of Object.entries(bank.slots || {})) {
      const slot = toSlotNumber(slotKey);
      if (!slot) continue;

      occupiedSlots.add(slot);

      if (!seen.has(slot)) seen.set(slot, []);
      seen.get(slot).push(entry);
    }

    for (const [slot, entries] of seen.entries()) {
      if (entries.length > 1) {
        conflicts.push({
          bank: bankName,
          slot,
          count: entries.length,
          files: entries.map((entry) => ({
            fileName: entry.fileName,
            relativePath: entry.relativePath,
          })),
        });
      }
    }

    const missing = [];
    for (let slot = 1; slot <= maxSlot; slot += 1) {
      if (!occupiedSlots.has(slot)) missing.push(slot);
    }

    missingSlotsByBank[bankName] = missing;
  }

  return {
    conflicts,
    missingSlotsByBank,
    diagnostics: [
      {
        type: "style-slot-diagnostics",
        level: conflicts.length ? "warn" : "info",
        message: conflicts.length
          ? `STYLE slot conflicts found: ${conflicts.length}`
          : "STYLE slot diagnostics passed with no conflicts",
        data: {
          conflictCount: conflicts.length,
          bankCount: Object.keys(catalog.banks).length,
        },
      },
    ],
  };
}

export { analyzeStyleSlotDiagnostics };
