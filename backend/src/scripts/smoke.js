import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { analyzePath } from '../services/analyzer.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..', '..', '..');
const samplesDir = path.join(rootDir, 'samples');
const sarSetPath = path.join(samplesDir, 'Korg', 'sar.SET');

const stat = await fs.stat(sarSetPath);
if (!stat.isDirectory()) throw new Error(`sar.SET smoke target is not a directory: ${sarSetPath}`);

const analysis = await analyzePath(sarSetPath, { rootDir: samplesDir });
if (analysis.kind !== 'directory') throw new Error('sar.SET smoke expected directory analysis.');
if (analysis.possibleBrand !== 'Korg') throw new Error(`sar.SET smoke expected Korg brand, got ${analysis.possibleBrand}.`);
if (!analysis.deepParserNeeded) throw new Error('sar.SET smoke expected deepParserNeeded.');
if (!analysis.fileCount || analysis.fileCount < 1) throw new Error('sar.SET smoke expected contained files.');
if (!analysis.extensionCounts || !Object.keys(analysis.extensionCounts).length) throw new Error('sar.SET smoke expected extension counts.');
if (analysis.korg?.parser !== 'korg-set-safe-adapter') throw new Error('sar.SET smoke expected Korg parser adapter output.');
if (analysis.korg.payloadDecoded !== false) throw new Error('sar.SET smoke expected payloadDecoded=false.');
if (analysis.korg.summary.styleFiles < 1) throw new Error('sar.SET smoke expected STYLE files.');
if (analysis.korg.style?.parser !== 'korg-style-bank-safe-scanner') throw new Error('sar.SET smoke expected STYLE bank parser output.');
if (analysis.korg.style.bankCount !== analysis.korg.summary.styleFiles) throw new Error('sar.SET smoke expected STYLE bank count to match summary.');
if (!analysis.korg.style.slotCandidateCount || analysis.korg.style.slotCandidateCount < analysis.korg.style.bankCount) throw new Error('sar.SET smoke expected STYLE slot candidates.');
if (!analysis.korg.style.bankFamilies?.FAVORITE?.bankCount) throw new Error('sar.SET smoke expected FAVORITE STYLE bank family.');
if (!analysis.korg.style.bankFamilies?.USER?.bankCount) throw new Error('sar.SET smoke expected USER STYLE bank family.');
if (!analysis.korg.style.banks?.every((bank) => Array.isArray(bank.entryCandidates) && bank.entryCandidates.length > 0)) throw new Error('sar.SET smoke expected STYLE entry candidates for each bank.');
if (analysis.korg.pad?.parser !== 'korg-pad-safe-scanner') throw new Error('sar.SET smoke expected PAD parser output.');
if (analysis.korg.pad.folderPresent !== true) throw new Error('sar.SET smoke expected PAD folder presence metadata.');
if (analysis.korg.dependencyGraph?.parser !== 'korg-set-dependency-safe-graph') throw new Error('sar.SET smoke expected SET dependency graph output.');
if (!analysis.korg.dependencyGraph.edges?.some((edge) => edge.from === 'style' && edge.to === 'sound')) throw new Error('sar.SET smoke expected STYLE to SOUND dependency candidate.');
if (!analysis.korg.layout?.some((folder) => folder.folder === 'PAD' && folder.fileCount === 0)) throw new Error('sar.SET smoke expected PAD folder layout entry.');
if (analysis.korg.summary.soundFiles < 1) throw new Error('sar.SET smoke expected SOUND metadata files.');
if (analysis.korg.sound?.parser !== 'korg-sound-metadata-safe-scanner') throw new Error('sar.SET smoke expected SOUND metadata parser output.');
if (analysis.korg.summary.pcmFiles < 1) throw new Error('sar.SET smoke expected PCM metadata index.');
if (analysis.korg.pcm?.parser !== 'korg-pcm-safe-indexer') throw new Error('sar.SET smoke expected PCM scanner output.');
if (analysis.korg.summary.songBookFiles < 1) throw new Error('sar.SET smoke expected SongBook metadata files.');
if (analysis.korg.songBook?.parser !== 'korg-songbook-safe-scanner') throw new Error('sar.SET smoke expected SongBook parser output.');

console.log(JSON.stringify({
  ok: true,
  id: analysis.id,
  brand: analysis.possibleBrand,
  fileCount: analysis.fileCount,
  size: analysis.size,
  extensionTypes: Object.keys(analysis.extensionCounts).length,
  korg: analysis.korg.summary,
  style: {
    parser: analysis.korg.style.parser,
    banks: analysis.korg.style.bankCount,
    slotCandidates: analysis.korg.style.slotCandidateCount,
    families: analysis.korg.style.bankFamilies
  },
  pad: {
    parser: analysis.korg.pad.parser,
    folderPresent: analysis.korg.pad.folderPresent,
    files: analysis.korg.pad.fileCount
  },
  dependencyGraph: {
    parser: analysis.korg.dependencyGraph.parser,
    nodes: analysis.korg.dependencyGraph.nodes.length,
    edges: analysis.korg.dependencyGraph.edges.length
  },
  parserLogs: analysis.korg.logs.length,
  parserDiagnostics: analysis.korg.diagnostics.length
}, null, 2));
