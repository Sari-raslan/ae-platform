// backend/parsers/korg/styleBankCatalog.js

function registerSlot(bankContainer, slot, entry) {
  const slotKey = String(slot);

  if (!bankContainer.slots[slotKey]) {
    bankContainer.slots[slotKey] = {
      slot,
      primaryEntry: entry,
      slotEntries: [entry],
      duplicates: [],
    };

    return;
  }

  const existing = bankContainer.slots[slotKey];

  existing.slotEntries.push(entry);
  existing.duplicates.push(entry);
}

function normalizeStyleFile(file) {
  // Extract bank and slot from filename or metadata
  // e.g., "STYLE_001.STY" -> { bank: "A", slot: 1 }
  // or from file.bank / file.slot / file.metadata properties
  
  const bank = file.bank || file.metadata?.bank || extractBankFromName(file.name || file.fileName || '');
  const slot = file.slot || file.metadata?.slot || extractSlotFromName(file.name || file.fileName || '');

  return {
    fileName: file.fileName || file.name || 'unknown',
    relativePath: file.relativePath || file.path || '',
    bank,
    slot: slot ? Number(slot) : null,
    size: file.size || 0,
    category: file.category || 'style',
  };
}

function extractBankFromName(filename) {
  // Try to extract bank from filename patterns
  // "FAVORITE_001.STY" -> "FAVORITE"
  // "USER_01.STY" -> "USER"
  // "STYLE_A_001.STY" -> "A"
  
  const match = filename.match(/^([A-Z_]+?)_?\d+/i);
  return match ? match[1] : null;
}

function extractSlotFromName(filename) {
  // Try to extract slot number from filename
  // "STYLE_001.STY" -> "001"
  // "USER_01.STY" -> "01"
  
  const match = filename.match(/_?(\d{1,3})(?:\.|$)/);
  return match ? match[1] : null;
}

function buildStyleBankCatalog(styleFiles = []) {
  const banks = {};
  const unassigned = [];

  for (const file of styleFiles) {
    const entry = normalizeStyleFile(file);

    if (!entry.bank || !entry.slot) {
      unassigned.push(entry);
      continue;
    }

    if (!banks[entry.bank]) {
      banks[entry.bank] = {
        bank: entry.bank,
        slots: {},
        slotCount: 0,
        duplicateSlotCount: 0,
      };
    }

    registerSlot(banks[entry.bank], entry.slot, entry);

    const slotData = banks[entry.bank].slots[String(entry.slot)];

    if (slotData.duplicates.length > 0) {
      banks[entry.bank].duplicateSlotCount += 1;
    }

    banks[entry.bank].slotCount += 1;
  }

  return {
    bankCount: Object.keys(banks).length,
    styleCount: styleFiles.length,
    assignedCount: styleFiles.length - unassigned.length,
    unassignedCount: unassigned.length,
    banks,
    unassigned,
  };
}

export { buildStyleBankCatalog, registerSlot, normalizeStyleFile };
