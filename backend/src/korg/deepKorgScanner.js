import fs from "node:fs";
import path from "node:path";

export function walkFiles(root) {
  if (!fs.existsSync(root)) return [];
  const out = [];

  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const full = path.join(root, entry.name);
    if (entry.isDirectory()) out.push(...walkFiles(full));
    else out.push(full);
  }

  return out;
}

export function extractAscii(buffer, min = 4, max = 200) {
  const out = [];
  let current = "";

  for (const b of buffer) {
    if (b >= 32 && b <= 126) current += String.fromCharCode(b);
    else {
      if (current.length >= min) out.push(current);
      current = "";
    }
  }

  if (current.length >= min) out.push(current);

  return [...new Set(out)].slice(0, max);
}

export function safeFileMeta(file, root) {
  const stat = fs.statSync(file);
  const buffer = fs.readFileSync(file);
  const name = path.basename(file);
  const lower = file.toLowerCase();

  let category = "UNKNOWN";
  if (lower.includes("style") || lower.endsWith(".sty")) category = "STYLE";
  if (lower.includes("pad") || lower.endsWith(".pad")) category = "PAD";
  if (lower.includes("sound") || lower.endsWith(".pcg")) category = "SOUND";
  if (lower.includes("pcm") || lower.includes("sample")) category = "PCM";
  if (lower.includes("songbook")) category = "SONGBOOK";
  if (lower.includes("global")) category = "GLOBAL";
  if (lower.includes("perform")) category = "PERFORMANCE";

  const strings = extractAscii(buffer);

  return {
    name,
    path: file,
    relativePath: path.relative(root, file),
    extension: path.extname(file).toLowerCase(),
    size: stat.size,
    category,
    strings,
    stringCount: strings.length,
    modifiedAt: stat.mtime.toISOString()
  };
}

export function scanKorgDeep(root) {
  const absolute = path.resolve(root);

  if (!fs.existsSync(absolute)) {
    return { ok: false, error: "Korg SET path not found", root: absolute };
  }

  const files = walkFiles(absolute);
  const entries = files.map(file => safeFileMeta(file, absolute));

  const counts = entries.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + 1;
    return acc;
  }, {});

  const dependencyNodes = Object.keys(counts).map(category => ({
    id: category,
    category,
    count: counts[category]
  }));

  const dependencyEdges = dependencyNodes
    .filter(n => n.category !== "UNKNOWN")
    .map(n => ({
      from: "SET",
      to: n.category,
      relation: "contains"
    }));

  return {
    ok: true,
    parser: "korg-deep-safe-scanner",
    brand: "Korg",
    root: absolute,
    fileCount: files.length,
    totalSize: entries.reduce((s, e) => s + Number(e.size || 0), 0),
    counts,
    styleFiles: entries.filter(e => e.category === "STYLE"),
    padFiles: entries.filter(e => e.category === "PAD"),
    soundFiles: entries.filter(e => e.category === "SOUND"),
    pcmFiles: entries.filter(e => e.category === "PCM"),
    songBookFiles: entries.filter(e => e.category === "SONGBOOK"),
    dependencyGraph: {
      nodes: dependencyNodes,
      edges: dependencyEdges
    },
    entries,
    scannedAt: new Date().toISOString(),
    safety: "metadata-only; no copyrighted sample payload decoding"
  };
}
