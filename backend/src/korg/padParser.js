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

function detectPadStrings(strings) {
  return strings.filter((value) => {
    const item = value.toLowerCase();
    return (
      item.includes("pad") ||
      item.includes("phrase") ||
      item.includes("loop") ||
      item.includes("trigger") ||
      item.includes("sample")
    );
  });
}

function resolvePadFiles(absolute) {
  const stat = fs.statSync(absolute);
  if (stat.isFile()) return { folderPresent: true, files: [absolute] };

  const padDir = path.basename(absolute).toUpperCase() === "PAD"
    ? absolute
    : path.join(absolute, "PAD");

  if (!fs.existsSync(padDir)) return { folderPresent: false, files: [] };

  const files = fs.readdirSync(padDir)
    .filter((name) => path.extname(name).toLowerCase() === ".pad")
    .map((name) => path.join(padDir, name));

  return { folderPresent: true, files };
}

function scanPadFile(filePath) {
  const stat = fs.statSync(filePath);
  const handle = fs.openSync(filePath, "r");
  const buffer = Buffer.alloc(Math.min(stat.size, MAX_SCAN_BYTES));

  try {
    fs.readSync(handle, buffer, 0, buffer.length, 0);
  } finally {
    fs.closeSync(handle);
  }

  const strings = extractAscii(buffer);
  const padStrings = detectPadStrings(strings);

  return {
    file: path.basename(filePath),
    size: stat.size,
    inspectedBytes: buffer.length,
    stringCount: strings.length,
    padStringCount: padStrings.length,
    padStrings: padStrings.slice(0, 120)
  };
}

export function parsePadBank(targetPath) {
  const absolute = path.resolve(targetPath);

  if (!fs.existsSync(absolute)) {
    return {
      ok: false,
      error: "PAD target not found"
    };
  }

  const { folderPresent, files } = resolvePadFiles(absolute);
  const pads = files.map(scanPadFile);

  return {
    ok: true,
    parser: "korg-pad-safe-scanner",
    target: path.basename(absolute),
    folderPresent,
    fileCount: pads.length,
    stringCount: pads.reduce((sum, pad) => sum + pad.stringCount, 0),
    padStringCount: pads.reduce((sum, pad) => sum + pad.padStringCount, 0),
    pads,
    note: folderPresent && pads.length === 0
      ? "PAD folder is present but contains no PAD bank files."
      : "PAD payloads are not decoded; scanner records safe string metadata only.",
    scannedAt: new Date().toISOString()
  };
}
