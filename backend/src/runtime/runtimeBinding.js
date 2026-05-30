import { createLiveArrangerRuntime } from "./liveArrangerRuntime.js";

function flattenStylesFromAnalysis(analysis = {}) {
  const catalog = analysis.styleBankCatalog || analysis.korg?.styleBankCatalog || {};
  const styles = [];

  for (const [bankName, bank] of Object.entries(catalog.banks || {})) {
    for (const [slotKey, slotInfo] of Object.entries(bank.slots || {})) {
      const entries = slotInfo.slotEntries || [slotInfo.primaryEntry].filter(Boolean);

      for (const entry of entries) {
        styles.push({
          ...entry,
          bank: entry.bank || bankName,
          slot: entry.slot || Number(slotKey),
        });
      }
    }
  }

  return styles;
}

function flattenPcmFromAnalysis(analysis = {}) {
  const pcm = analysis.pcm || analysis.korg?.pcm || [];
  const links = analysis.pcmDependencyDiagnostics?.links || [];

  if (Array.isArray(pcm)) return pcm;

  if (Array.isArray(pcm.files)) return pcm.files;

  return links.map((link) => link.pcm).filter(Boolean);
}

function flattenSongBookFromAnalysis(analysis = {}) {
  const songBook = analysis.songBook || analysis.korg?.songBook || [];
  const links = analysis.songBookStyleLinks?.links || [];

  if (Array.isArray(songBook)) return songBook;
  if (Array.isArray(songBook.entries)) return songBook.entries;

  return links.map((link) => ({
    ...(link.songBookEntry || {}),
    linkedStyle: link.style?.fileName || null,
  }));
}

export function bindAnalysisToLiveRuntime(analysis = {}) {
  const styles = flattenStylesFromAnalysis(analysis);
  const pcm = flattenPcmFromAnalysis(analysis);
  const songBook = flattenSongBookFromAnalysis(analysis);

  return createLiveArrangerRuntime({
    setName: analysis.setName || analysis.name || "Runtime SET",
    styles,
    pcm,
    songBook,
    midi: {
      clock: "internal",
      input: "web-midi",
      output: "arranger-engine",
      channel: 1,
    },
  });
}
