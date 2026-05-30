const fs = require("fs");
const path = require("path");

function walk(dir) {
  const out = [];

  if (!fs.existsSync(dir)) return out;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      out.push(...walk(full));
    } else {
      out.push(full);
    }
  }

  return out;
}

function extractAsciiStrings(buffer, min = 4, max = 300) {
  const strings = [];
  let current = "";

  for (const byte of buffer) {
    if (byte >= 32 && byte <= 126) {
      current += String.fromCharCode(byte);
    } else {
      if (current.length >= min) strings.push(current);
      current = "";
    }
  }

  if (current.length >= min) strings.push(current);

  return [...new Set(strings)]
    .map(s => s.trim())
    .filter(Boolean)
    .slice(0, max);
}

function classifyStyleFamily(relativePath) {
  const p = relativePath.toUpperCase();

  if (p.includes("FAVORITE")) return "FAVORITE";
  if (p.includes("USER")) return "USER";
  if (p.includes("STYLE")) return "STYLE";
  if (p.includes("DIRECT")) return "DIRECT";

  return "UNKNOWN";
}

function isStyleFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const base = path.basename(filePath).toLowerCase();
  const full = filePath.toLowerCase();

  return (
    ext === ".sty" ||
    base.includes("style") ||
    full.includes("\\style") ||
    full.includes("/style") ||
    full.includes("favorite") ||
    full.includes("user")
  );
}

function detectSlotCandidates(strings) {
  const candidates = [];

  for (const s of strings) {
    const lower = s.toLowerCase();

    if (
      lower.includes("intro") ||
      lower.includes("variation") ||
      lower.includes("var") ||
      lower.includes("fill") ||
      lower.includes("break") ||
      lower.includes("ending") ||
      lower.includes("style")
    ) {
      candidates.push({
        label: s,
        confidence: "string-match"
      });
    }
  }

  return candidates.slice(0, 64);
}

function estimateSlotsFromSize(size) {
  if (size <= 0) return 0;

  const rough = Math.floor(size / 4096);

  return Math.max(1, Math.min(32, rough));
}

function scanStyleBank(filePath, rootPath) {
  const stat = fs.statSync(filePath);
  const buffer = fs.readFileSync(filePath);
  const relativePath = path.relative(rootPath, filePath);

  const strings = extractAsciiStrings(buffer);
  const stringSlots = detectSlotCandidates(strings);
  const estimatedSlotCount = estimateSlotsFromSize(stat.size);

  const syntheticSlots = Array.from({ length: estimatedSlotCount }).map((_, i) => ({
    slot: i + 1,
    name: stringSlots[i]?.label || `Slot ${i + 1}`,
    source: stringSlots[i] ? "string-candidate" : "size-estimate",
    confidence: stringSlots[i] ? "medium" : "low"
  }));

  return {
    id: relativePath.replaceAll("\\", "/"),
    name: path.basename(filePath),
    relativePath: relativePath.replaceAll("\\", "/"),
    extension: path.extname(filePath).toLowerCase(),
    size: stat.size,
    family: classifyStyleFamily(relativePath),
    strings: strings.slice(0, 80),
    slotCandidates: syntheticSlots,
    slotCandidateCount: syntheticSlots.length,
    scannedAt: new Date().toISOString()
  };
}

function scanKorgStyleBanks(setPath) {
  const root = path.resolve(setPath);

  if (!fs.existsSync(root)) {
    return {
      ok: false,
      error: "SET path not found",
      root
    };
  }

  const files = walk(root).filter(isStyleFile);

  const banks = files.map(file => scanStyleBank(file, root));

  const families = banks.reduce((acc, bank) => {
    if (!acc[bank.family]) {
      acc[bank.family] = {
        bankCount: 0,
        slotCandidateCount: 0
      };
    }

    acc[bank.family].bankCount += 1;
    acc[bank.family].slotCandidateCount += bank.slotCandidateCount;

    return acc;
  }, {});

  return {
    ok: true,
    parser: "korg-style-bank-slot-safe-extractor",
    root,
    bankCount: banks.length,
    slotCandidateCount: banks.reduce((sum, b) => sum + b.slotCandidateCount, 0),
    families,
    banks
  };
}

module.exports = {
  scanKorgStyleBanks,
  scanStyleBank,
  extractAsciiStrings,
  classifyStyleFamily
};
