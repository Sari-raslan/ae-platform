// backend/parsers/korg/styleSlotResolution.js

export function summarizeStyleSlotResolution(styleSlotDiagnostics = {}) {
  const conflicts = styleSlotDiagnostics.conflicts || [];

  return {
    hasConflicts: conflicts.length > 0,
    conflictCount: conflicts.length,
    affectedBanks: [...new Set(conflicts.map((item) => item.bank))],
    affectedSlots: conflicts.map((item) => ({
      bank: item.bank,
      slot: item.slot,
      fileCount: item.count,
      recommendedAction: "review-duplicate-style-slot",
    })),
  };
}

export function resolveStyleSlotConflicts(catalog = {}, strategy = "keep-primary") {
  const banks = catalog.banks || {};
  const resolutions = {};

  for (const [bankName, bank] of Object.entries(banks)) {
    resolutions[bankName] = {
      bank: bankName,
      resolved: 0,
      conflicts: [],
    };

    for (const [slotKey, slotData] of Object.entries(bank.slots || {})) {
      if (!slotData.duplicates || slotData.duplicates.length === 0) {
        continue;
      }

      const conflict = {
        slot: slotData.slot,
        primaryEntry: slotData.primaryEntry?.fileName,
        duplicateEntries: slotData.duplicates.map((dup) => dup.fileName),
        strategy,
      };

      if (strategy === "keep-primary") {
        conflict.action = `Keep primary entry (${slotData.primaryEntry?.fileName}), remove ${slotData.duplicates.length} duplicate(s)`;
        conflict.retained = slotData.primaryEntry?.fileName;
        conflict.removed = slotData.duplicates.map((dup) => dup.fileName);
      } else if (strategy === "keep-all") {
        conflict.action = `Retain all ${slotData.slotEntries.length} entries`;
        conflict.retained = slotData.slotEntries.map((e) => e.fileName);
      } else if (strategy === "keep-largest") {
        const largest = slotData.slotEntries.reduce((max, e) =>
          (e.size || 0) > (max.size || 0) ? e : max
        );
        conflict.action = `Keep largest entry (${largest.fileName}, ${largest.size} bytes), remove others`;
        conflict.retained = largest.fileName;
        conflict.removed = slotData.slotEntries
          .filter((e) => e.fileName !== largest.fileName)
          .map((e) => e.fileName);
      }

      resolutions[bankName].conflicts.push(conflict);
      resolutions[bankName].resolved += 1;
    }
  }

  return {
    strategy,
    totalBanks: Object.keys(banks).length,
    banksWithConflicts: Object.values(resolutions).filter((b) => b.resolved > 0)
      .length,
    totalConflictsResolved: Object.values(resolutions).reduce(
      (sum, b) => sum + b.resolved,
      0
    ),
    resolutions,
  };
}

export function formatStyleSlotReport(catalog = {}, diagnostics = {}) {
  const summary = summarizeStyleSlotResolution(diagnostics);
  const resolution = resolveStyleSlotConflicts(catalog, "keep-primary");

  return {
    summary,
    resolution,
    report: {
      title: "Korg STYLE Slot Resolution Report",
      timestamp: new Date().toISOString(),
      hasIssues: summary.hasConflicts,
      issueCount: summary.conflictCount,
      message: summary.hasConflicts
        ? `Found ${summary.conflictCount} STYLE slot conflict(s) in ${summary.affectedBanks.length} bank(s)`
        : "All STYLE slots are unique - no conflicts detected",
      affectedBanks: summary.affectedBanks,
      recommendedActions: summary.affectedSlots.map((slot) => ({
        bank: slot.bank,
        slot: slot.slot,
        action: slot.recommendedAction,
      })),
    },
  };
}
