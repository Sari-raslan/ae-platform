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
if (analysis.korg.summary.soundFiles < 1) throw new Error('sar.SET smoke expected SOUND metadata files.');
if (analysis.korg.summary.pcmFiles < 1) throw new Error('sar.SET smoke expected PCM metadata index.');
if (analysis.korg.summary.songBookFiles < 1) throw new Error('sar.SET smoke expected SongBook metadata files.');

console.log(JSON.stringify({
  ok: true,
  id: analysis.id,
  brand: analysis.possibleBrand,
  fileCount: analysis.fileCount,
  size: analysis.size,
  extensionTypes: Object.keys(analysis.extensionCounts).length,
  korg: analysis.korg.summary,
  parserLogs: analysis.korg.logs.length,
  parserDiagnostics: analysis.korg.diagnostics.length
}, null, 2));
