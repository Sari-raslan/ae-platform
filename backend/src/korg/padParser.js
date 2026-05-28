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

function detectPadStrings(strings) {

  return strings.filter(x => {

    const s = x.toLowerCase();

    return (
      s.includes("pad") ||
      s.includes("phrase") ||
      s.includes("loop") ||
      s.includes("trigger") ||
      s.includes("sample")
    );
  });

}

function parsePadBank(targetPath) {

  const absolute = path.resolve(targetPath);

  if (!fs.existsSync(absolute)) {

    return {
      ok: false,
      error: "PAD target not found"
    };

  }

  const stat = fs.statSync(absolute);

  const buffer = fs.readFileSync(absolute);

  const strings = extractAscii(buffer);

  const padStrings = detectPadStrings(strings);

  return {

    ok: true,
    parser: "korg-pad-safe-scanner",
    file: path.basename(targetPath),
    size: stat.size,
    stringCount: strings.length,
    padStringCount: padStrings.length,
    padStrings: padStrings.slice(0, 120),
    scannedAt: new Date().toISOString()

  };

}

module.exports = {
  parsePadBank
};
