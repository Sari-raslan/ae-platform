const fs = require("fs");
const path = require("path");

function extractAscii(buffer, min = 4) {
  const results = [];

  let current = "";

  for (const byte of buffer) {
    if (byte >= 32 && byte <= 126) {
      current += String.fromCharCode(byte);
    } else {
      if (current.length >= min) {
        results.push(current);
      }

      current = "";
    }
  }

  if (current.length >= min) {
    results.push(current);
  }

  return [...new Set(results)];
}

function detectStyleNames(strings) {
  return strings.filter(x => {
    const s = x.toLowerCase();

    return (
      s.includes("style") ||
      s.includes("intro") ||
      s.includes("variation") ||
      s.includes("ending") ||
      s.includes("fill") ||
      s.includes("break")
    );
  });
}

function parseStyleBank(filePath) {
  const absolute = path.resolve(filePath);

  if (!fs.existsSync(absolute)) {
    return {
      ok: false,
      error: "File not found"
    };
  }

  const stat = fs.statSync(absolute);

  const buffer = fs.readFileSync(absolute);

  const strings = extractAscii(buffer);

  const styleStrings = detectStyleNames(strings);

  return {
    ok: true,
    parser: "STYLE_BANK_FOUNDATION",
    file: path.basename(filePath),
    size: stat.size,
    stringCount: strings.length,
    styleStringCount: styleStrings.length,
    styleStrings: styleStrings.slice(0, 100),
    scannedAt: new Date().toISOString()
  };
}

module.exports = {
  parseStyleBank
};
