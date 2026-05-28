import fs from "node:fs";
import path from "node:path";

const MAX_SCAN_BYTES = 256 * 1024;

function extractAscii(buffer, min = 4) {
  const results = [];
  let current = "";

  for (const byte of buffer) {
    if (byte >= 32 && byte <= 126) {
      current += String.fromCharCode(byte);
    } else {
      if (current.length >= min) results.push(current);
      current = "";
    }
  }

  if (current.length >= min) results.push(current);
  return [...new Set(results)];
}

function detectStyleNames(strings) {
  return strings.filter((value) => {
    const item = value.toLowerCase();
    return (
      item.includes("style") ||
      item.includes("intro") ||
      item.includes("variation") ||
      item.includes("ending") ||
      item.includes("fill") ||
      item.includes("break")
    );
  });
}

function resolveStyleFiles(absolute) {
  const stat = fs.statSync(absolute);
  if (stat.isFile()) return [absolute];

  const styleDir = path.basename(absolute).toUpperCase() === "STYLE"
    ? absolute
    : path.join(absolute, "STYLE");

  if (!fs.existsSync(styleDir)) return [];

  return fs.readdirSync(styleDir)
    .filter((name) => path.extname(name).toLowerCase() === ".sty")
    .map((name) => path.join(styleDir, name));
}

function scanStyleFile(filePath) {
  const stat = fs.statSync(filePath);
  const handle = fs.openSync(filePath, "r");
  const buffer = Buffer.alloc(Math.min(stat.size, MAX_SCAN_BYTES));

  try {
    fs.readSync(handle, buffer, 0, buffer.length, 0);
  } finally {
    fs.closeSync(handle);
  }

  const strings = extractAscii(buffer);
  const styleStrings = detectStyleNames(strings);

  return {
    file: path.basename(filePath),
    size: stat.size,
    inspectedBytes: buffer.length,
    stringCount: strings.length,
    styleStringCount: styleStrings.length,
    styleStrings: styleStrings.slice(0, 100)
  };
}

export function parseStyleBank(targetPath) {
  const absolute = path.resolve(targetPath);

  if (!fs.existsSync(absolute)) {
    return {
      ok: false,
      error: "STYLE target not found"
    };
  }

  const files = resolveStyleFiles(absolute);
  const banks = files.map(scanStyleFile);

  return {
    ok: true,
    parser: "STYLE_BANK_FOUNDATION",
    target: path.basename(absolute),
    fileCount: banks.length,
    stringCount: banks.reduce((sum, bank) => sum + bank.stringCount, 0),
    styleStringCount: banks.reduce((sum, bank) => sum + bank.styleStringCount, 0),
    banks,
    scannedAt: new Date().toISOString()
  };
}
