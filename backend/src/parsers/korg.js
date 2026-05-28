import fs from 'node:fs/promises';
import path from 'node:path';

const MAX_METADATA_READ = 256 * 1024;
const MAX_CHUNK_CANDIDATES = 24;
const MAX_STRING_CANDIDATES = 40;
const MAX_STYLE_ENTRY_CANDIDATES = 32;

const KORG_FOLDERS = {
  STYLE: 'style',
  PAD: 'pad',
  SOUND: 'sound',
  PCM: 'pcm',
  SONGBOOK: 'songbook',
  MULTISMP: 'multisample',
  PERFORM: 'performance',
  GLOBAL: 'global'
};

export function isKorgSetPath(targetPath) {
  return path.extname(targetPath).toLowerCase() === '.set' || targetPath.toLowerCase().includes(`${path.sep}korg${path.sep}`);
}

export async function analyzeKorgSetDirectory(targetPath, rootDir, filePaths) {
  const diagnostics = [];
  const logs = [];
  const files = [];
  const folders = await listSetFolders(targetPath, diagnostics);

  for (const filePath of filePaths) {
    try {
      const stat = await fs.stat(filePath);
      files.push({
        filePath,
        id: relativeId(filePath, rootDir),
        name: path.basename(filePath),
        folder: detectKorgFolder(filePath, targetPath),
        extension: path.extname(filePath).toLowerCase() || '[none]',
        size: stat.size
      });
    } catch (error) {
      diagnostics.push(diagnostic('warn', 'file-stat-failed', relativeId(filePath, rootDir), error.message));
    }
  }

  const grouped = groupBy(files, (file) => file.folder || 'unknown');
  logs.push(log('directory-index', `Indexed ${files.length} files in ${relativeId(targetPath, rootDir)}.`));

  return {
    parser: 'korg-set-safe-adapter',
    copyrightSafe: true,
    payloadDecoded: false,
    summary: {
      styleFiles: grouped.style?.length || 0,
      padFiles: grouped.pad?.length || 0,
      soundFiles: grouped.sound?.length || 0,
      pcmFiles: grouped.pcm?.length || 0,
      songBookFiles: grouped.songbook?.length || 0,
      unknownFiles: grouped.unknown?.length || 0
    },
    style: await analyzeStyleFiles(grouped.style || [], diagnostics, logs),
    pad: await analyzePadFiles(grouped.pad || [], diagnostics, logs, folders),
    sound: await analyzeSoundFiles(grouped.sound || [], diagnostics, logs),
    pcm: await analyzePcmFiles(grouped.pcm || [], diagnostics, logs),
    songBook: await analyzeSongBookFiles(grouped.songbook || [], diagnostics, logs),
    otherFolders: summarizeOtherFolders(grouped),
    layout: summarizeSetLayout(folders, grouped),
    dependencyGraph: buildSetDependencyGraph(grouped, folders),
    diagnostics,
    logs
  };
}

export function analyzeKorgFile(filePath, buffer, stat, rootDir) {
  const folder = detectKorgFolder(filePath);
  const extension = path.extname(filePath).toLowerCase();
  if (!folder && !['.sty', '.pcg', '.pcm', '.sbd', '.sbl', '.pad'].includes(extension)) return null;

  const metadata = inspectBuffer(buffer, stat.size);
  const common = {
    parser: `korg-${folder || extension.slice(1) || 'binary'}-safe-adapter`,
    folder,
    payloadDecoded: false,
    copyrightSafe: true,
    chunkCandidates: scanChunkCandidates(buffer),
    strings: extractStrings(buffer).slice(0, MAX_STRING_CANDIDATES),
    diagnostics: [
      diagnostic('info', 'safe-metadata-only', relativeId(filePath, rootDir), 'Inspected headers, strings, and chunk candidates without decoding sample or musical payload data.')
    ],
    metadata
  };

  if (folder === 'pcm' || extension === '.pcm') {
    return {
      ...common,
      pcm: {
        headerHex: toHex(buffer.subarray(0, 64)),
        inspectedBytes: buffer.length,
        totalBytes: stat.size,
        payloadSkippedBytes: Math.max(stat.size - buffer.length, 0)
      }
    };
  }

  if (folder === 'style' || extension === '.sty') {
    const styleEntries = extractStyleEntryCandidates(buffer);
    return {
      ...common,
      style: {
        ...deriveStyleBankInfo(path.basename(filePath, extension)),
        structure: inferStructure(buffer, 'style'),
        nameCandidates: styleEntries.map((entry) => entry.name).slice(0, 24),
        entryCandidates: styleEntries
      }
    };
  }

  if (folder === 'pad' || extension === '.pad') {
    return {
      ...common,
      pad: {
        structure: inferStructure(buffer, 'pad'),
        nameCandidates: common.strings.slice(0, 24)
      }
    };
  }

  if (folder === 'sound' || extension === '.pcg') {
    return {
      ...common,
      sound: {
        bankName: path.basename(filePath, extension),
        programNameCandidates: common.strings.slice(0, 32),
        structure: inferStructure(buffer, 'sound')
      }
    };
  }

  if (folder === 'songbook' || extension === '.sbd' || extension === '.sbl') {
    return {
      ...common,
      songBook: {
        entryNameCandidates: common.strings.slice(0, 32),
        structure: inferStructure(buffer, 'songbook')
      }
    };
  }

  return common;
}

async function analyzeStyleFiles(files, diagnostics, logs) {
  const banks = [];
  for (const file of files) {
    const scan = await scanFileMetadata(file, diagnostics);
    if (scan) {
      const bankInfo = deriveStyleBankInfo(path.basename(file.name, path.extname(file.name)));
      const entryCandidates = extractStyleEntryCandidates(scan.buffer);
      banks.push({
        id: file.id,
        name: file.name,
        size: file.size,
        ...bankInfo,
        structure: inferStructure(scan.buffer, 'style'),
        slotCount: entryCandidates.length,
        nameCandidates: entryCandidates.map((entry) => entry.name).slice(0, 16),
        entryCandidates,
        chunkCandidates: scan.chunks
      });
    }
  }
  logs.push(log('style-scan', `Scanned ${banks.length} STYLE bank files.`));
  return {
    parser: 'korg-style-bank-safe-scanner',
    bankCount: banks.length,
    slotCandidateCount: banks.reduce((sum, bank) => sum + bank.slotCount, 0),
    bankFamilies: summarizeStyleFamilies(banks),
    banks,
    note: 'STYLE banks are indexed as proprietary containers; names, slots, offsets, and chunks are candidates only.'
  };
}

async function analyzePadFiles(files, diagnostics, logs, folders = []) {
  const pads = [];
  const folderPresent = folders.includes('PAD');
  for (const file of files) {
    const scan = await scanFileMetadata(file, diagnostics);
    if (scan) {
      pads.push({
        id: file.id,
        name: file.name,
        size: file.size,
        structure: inferStructure(scan.buffer, 'pad'),
        nameCandidates: scan.strings.slice(0, 16),
        chunkCandidates: scan.chunks
      });
    }
  }
  if (!files.length) {
    diagnostics.push(diagnostic(
      'info',
      folderPresent ? 'pad-folder-empty' : 'pad-folder-missing',
      'PAD',
      folderPresent ? 'PAD folder is present but contains no PAD files.' : 'No PAD folder or PAD files were present in this SET.'
    ));
  }
  logs.push(log('pad-scan', `Scanned ${pads.length} PAD files.`));
  return {
    parser: 'korg-pad-safe-scanner',
    folderPresent,
    fileCount: pads.length,
    pads,
    note: 'PAD payloads are not decoded; scanner records safe container metadata when files exist.'
  };
}

async function analyzeSoundFiles(files, diagnostics, logs) {
  const banks = [];
  for (const file of files) {
    const scan = await scanFileMetadata(file, diagnostics);
    if (scan) {
      banks.push({
        id: file.id,
        name: file.name,
        size: file.size,
        bank: path.basename(file.name, path.extname(file.name)),
        programNameCandidates: scan.strings.slice(0, 24),
        chunkCandidates: scan.chunks,
        structure: inferStructure(scan.buffer, 'sound')
      });
    }
  }
  logs.push(log('sound-scan', `Scanned ${banks.length} SOUND/PCG files.`));
  return {
    parser: 'korg-sound-metadata-safe-scanner',
    bankCount: banks.length,
    banks
  };
}

async function analyzePcmFiles(files, diagnostics, logs) {
  const entries = files.map((file) => ({
    id: file.id,
    name: file.name,
    size: file.size,
    payloadDecoded: false
  }));
  const sizes = entries.map((entry) => entry.size);
  logs.push(log('pcm-index', `Indexed ${entries.length} PCM files without reading sample payloads.`));
  return {
    parser: 'korg-pcm-safe-indexer',
    fileCount: entries.length,
    totalBytes: sizes.reduce((sum, size) => sum + size, 0),
    minBytes: sizes.length ? Math.min(...sizes) : 0,
    maxBytes: sizes.length ? Math.max(...sizes) : 0,
    files: entries.slice(0, 140),
    note: 'PCM sample payloads are counted and indexed only; audio/sample content is not decoded.'
  };
}

async function analyzeSongBookFiles(files, diagnostics, logs) {
  const databases = [];
  for (const file of files) {
    const scan = await scanFileMetadata(file, diagnostics);
    if (scan) {
      databases.push({
        id: file.id,
        name: file.name,
        size: file.size,
        entryNameCandidates: scan.strings.slice(0, 24),
        chunkCandidates: scan.chunks,
        structure: inferStructure(scan.buffer, 'songbook')
      });
    }
  }
  logs.push(log('songbook-scan', `Scanned ${databases.length} SongBook files.`));
  return {
    parser: 'korg-songbook-safe-scanner',
    fileCount: databases.length,
    databases
  };
}

async function scanFileMetadata(file, diagnostics) {
  try {
    const buffer = await readPrefix(file.filePath);
    return {
      buffer,
      strings: extractStrings(buffer).slice(0, MAX_STRING_CANDIDATES),
      chunks: scanChunkCandidates(buffer)
    };
  } catch (error) {
    diagnostics.push(diagnostic('warn', 'file-scan-failed', file.id, error.message));
    return null;
  }
}

async function readPrefix(filePath) {
  const handle = await fs.open(filePath, 'r');
  try {
    const stat = await handle.stat();
    const buffer = Buffer.alloc(Math.min(stat.size, MAX_METADATA_READ));
    await handle.read(buffer, 0, buffer.length, 0);
    return buffer;
  } finally {
    await handle.close();
  }
}

function scanChunkCandidates(buffer) {
  const candidates = [];
  const limit = Math.max(buffer.length - 8, 0);
  for (let offset = 0; offset < limit && candidates.length < MAX_CHUNK_CANDIDATES; offset += 1) {
    const tag = buffer.subarray(offset, offset + 4).toString('latin1');
    if (!/^[A-Za-z0-9_ -]{4}$/.test(tag)) continue;
    const beLength = buffer.readUInt32BE(offset + 4);
    const leLength = buffer.readUInt32LE(offset + 4);
    const remaining = buffer.length - offset - 8;
    const plausibleLength = [beLength, leLength].find((value) => value > 0 && value <= remaining);
    if (!plausibleLength) continue;
    candidates.push({
      offset,
      tag,
      length: plausibleLength,
      endian: plausibleLength === beLength ? 'be' : 'le'
    });
    offset += 3;
  }
  return candidates;
}

function inferStructure(buffer, kind) {
  const chunks = scanChunkCandidates(buffer);
  const strings = extractStrings(buffer);
  return {
    kind,
    inspectedBytes: buffer.length,
    chunkCandidateCount: chunks.length,
    stringCandidateCount: strings.length,
    hasSparseTextMetadata: strings.length > 0,
    unknownChunksTolerated: true
  };
}

function deriveStyleBankInfo(bankName) {
  const match = String(bankName).match(/^([A-Za-z_ -]+?)(\d+)?$/);
  const bankFamily = match?.[1]?.replace(/[_ -]+$/g, '').toUpperCase() || String(bankName).toUpperCase();
  const bankNumber = match?.[2] ? Number(match[2]) : null;
  return {
    bank: bankName,
    bankFamily,
    bankNumber
  };
}

function extractStyleEntryCandidates(buffer) {
  const candidates = [];
  const seen = new Set();
  let start = null;

  for (let index = 0; index <= buffer.length; index += 1) {
    const byte = buffer[index];
    const isTextByte = byte >= 32 && byte <= 126;

    if (isTextByte && start == null) {
      start = index;
      continue;
    }

    if ((start != null && !isTextByte) || (start != null && index === buffer.length)) {
      const end = index;
      const raw = buffer.subarray(start, end).toString('latin1').trim();
      start = null;

      if (!isLikelyStyleName(raw) || seen.has(raw.toLowerCase())) continue;
      seen.add(raw.toLowerCase());
      candidates.push({
        slot: candidates.length + 1,
        name: raw,
        offset: end - raw.length,
        length: raw.length
      });

      if (candidates.length >= MAX_STYLE_ENTRY_CANDIDATES) break;
    }
  }

  return candidates;
}

function isLikelyStyleName(value) {
  if (!value || value.length < 4 || value.length > 32) return false;
  if (value === 'KORF') return false;
  const letters = value.match(/[A-Za-z]/g)?.length || 0;
  if (letters < 2) return false;
  const noisy = value.match(/[^\w .,'+&/()-]/g)?.length || 0;
  return noisy <= 1;
}

function summarizeStyleFamilies(banks) {
  return banks.reduce((families, bank) => {
    const family = bank.bankFamily || 'UNKNOWN';
    families[family] ||= { bankCount: 0, slotCandidateCount: 0 };
    families[family].bankCount += 1;
    families[family].slotCandidateCount += bank.slotCount || 0;
    return families;
  }, {});
}

function inspectBuffer(buffer, totalBytes) {
  const zeroBytes = countBytes(buffer, 0);
  const asciiBytes = buffer.filter((byte) => byte >= 32 && byte <= 126).length;
  return {
    inspectedBytes: buffer.length,
    totalBytes,
    asciiRatio: buffer.length ? Number((asciiBytes / buffer.length).toFixed(3)) : 0,
    zeroByteRatio: buffer.length ? Number((zeroBytes / buffer.length).toFixed(3)) : 0,
    headerHex: toHex(buffer.subarray(0, 64))
  };
}

function detectKorgFolder(filePath, setRoot = '') {
  const relative = setRoot ? path.relative(setRoot, filePath) : filePath;
  const parts = relative.split(path.sep).filter(Boolean).map((part) => part.toUpperCase());
  const folder = parts.find((part) => KORG_FOLDERS[part]);
  return KORG_FOLDERS[folder] || null;
}

function summarizeOtherFolders(grouped) {
  return Object.entries(grouped)
    .filter(([folder]) => !['style', 'pad', 'sound', 'pcm', 'songbook'].includes(folder))
    .map(([folder, files]) => ({
      folder,
      fileCount: files.length,
      totalBytes: files.reduce((sum, file) => sum + file.size, 0)
    }));
}

async function listSetFolders(targetPath, diagnostics) {
  try {
    const entries = await fs.readdir(targetPath, { withFileTypes: true });
    return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name.toUpperCase()).sort();
  } catch (error) {
    diagnostics.push(diagnostic('warn', 'set-folder-scan-failed', targetPath, error.message));
    return [];
  }
}

function summarizeSetLayout(folders, grouped) {
  return folders.map((folder) => {
    const key = KORG_FOLDERS[folder] || folder.toLowerCase();
    const files = grouped[key] || [];
    return {
      folder,
      key,
      fileCount: files.length,
      totalBytes: files.reduce((sum, file) => sum + file.size, 0)
    };
  });
}

function buildSetDependencyGraph(grouped, folders) {
  const nodes = folders.map((folder) => {
    const key = KORG_FOLDERS[folder] || folder.toLowerCase();
    const files = grouped[key] || [];
    return {
      id: key,
      label: folder,
      type: 'folder',
      fileCount: files.length,
      totalBytes: files.reduce((sum, file) => sum + file.size, 0)
    };
  });

  const has = (key) => nodes.some((node) => node.id === key);
  const edges = [
    has('style') && has('sound') ? dependencyEdge('style', 'sound', 'STYLE banks may reference SOUND programs') : null,
    has('style') && has('pcm') ? dependencyEdge('style', 'pcm', 'STYLE banks may indirectly depend on PCM samples') : null,
    has('pad') && has('sound') ? dependencyEdge('pad', 'sound', 'PAD entries may reference SOUND programs') : null,
    has('sound') && has('pcm') ? dependencyEdge('sound', 'pcm', 'SOUND programs may reference PCM samples') : null,
    has('songbook') && has('style') ? dependencyEdge('songbook', 'style', 'SongBook entries may reference STYLE banks') : null,
    has('performance') && has('style') ? dependencyEdge('performance', 'style', 'Performances may reference STYLE banks') : null,
    has('global') && has('style') ? dependencyEdge('global', 'style', 'GLOBAL settings may affect STYLE playback') : null
  ].filter(Boolean);

  return {
    parser: 'korg-set-dependency-safe-graph',
    nodes,
    edges,
    note: 'Graph edges are folder-level dependency candidates inferred from Korg SET layout only; no proprietary references are decoded.'
  };
}

function dependencyEdge(from, to, reason) {
  return { from, to, confidence: 'layout-inferred', reason };
}

function extractStrings(buffer) {
  const text = buffer.toString('latin1').replace(/[^\x20-\x7e]+/g, '\n');
  return unique(text.split('\n').map((item) => item.trim()).filter((item) => item.length >= 4));
}

function groupBy(values, selector) {
  return values.reduce((groups, value) => {
    const key = selector(value);
    groups[key] ||= [];
    groups[key].push(value);
    return groups;
  }, {});
}

function diagnostic(level, code, target, message) {
  return { level, code, target, message };
}

function log(stage, message) {
  return { stage, message, at: new Date().toISOString() };
}

function relativeId(filePath, rootDir) {
  return path.relative(rootDir, filePath).replaceAll(path.sep, '/');
}

function toHex(buffer) {
  return buffer.toString('hex').match(/.{1,2}/g)?.join(' ') || '';
}

function countBytes(buffer, expected) {
  let count = 0;
  for (const byte of buffer) {
    if (byte === expected) count += 1;
  }
  return count;
}

function unique(values) {
  return [...new Set(values)];
}
