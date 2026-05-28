import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { analyzePath } from '../services/analyzer.js';
import { ensureDir } from '../services/library.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..', '..', '..');
const samplePath = path.join(rootDir, 'samples', 'Korg', 'sar.SET');
const docsDir = path.join(rootDir, 'docs');

await ensureDir(docsDir);
const analysis = await analyzePath(samplePath, { rootDir: path.join(rootDir, 'samples') });
await fs.writeFile(path.join(docsDir, 'sar-set-analysis.json'), `${JSON.stringify(analysis, null, 2)}\n`);

const korg = analysis.korg;
const notes = [
  '# sar.SET Safe Analysis',
  '',
  `Analyzed at: ${analysis.analyzedAt}`,
  `Detected brand: ${analysis.possibleBrand}`,
  `Files inspected: ${analysis.fileCount}`,
  `Total bytes: ${analysis.size}`,
  '',
  'This is a directory-based arranger keyboard set. The analyzer only extracts safe metadata, extension counts, short ASCII strings, and hex previews. It does not decode proprietary style, sound, PCM, or performance payloads.',
  '',
  '## Extension counts',
  '',
  ...Object.entries(analysis.extensionCounts || {}).sort().map(([ext, count]) => `- ${ext}: ${count}`),
  '',
  '## Korg parser summary',
  '',
  `Parser: ${korg?.parser || 'not available'}`,
  `STYLE banks: ${korg?.summary?.styleFiles || 0}`,
  `STYLE slot candidates: ${korg?.style?.slotCandidateCount || 0}`,
  `STYLE bank families: ${Object.keys(korg?.style?.bankFamilies || {}).join(', ') || 'none'}`,
  `PAD files: ${korg?.summary?.padFiles || 0}`,
  `PAD folder present: ${korg?.pad?.folderPresent ? 'yes' : 'no'}`,
  `SOUND banks: ${korg?.summary?.soundFiles || 0}`,
  `PCM files indexed: ${korg?.summary?.pcmFiles || 0}`,
  `SongBook files: ${korg?.summary?.songBookFiles || 0}`,
  `SET graph nodes: ${korg?.dependencyGraph?.nodes?.length || 0}`,
  `SET graph edges: ${korg?.dependencyGraph?.edges?.length || 0}`,
  `Payload decoded: ${korg?.payloadDecoded ? 'yes' : 'no'}`,
  `Diagnostics: ${korg?.diagnostics?.length || 0}`,
  `Parser log entries: ${korg?.logs?.length || 0}`,
  '',
  'The Phase 3 Korg adapter indexes proprietary containers, chunk candidates, strings, style slot candidates, counts, and sizes only. Unknown chunks are tolerated and PCM sample payloads are never decoded.',
  '',
  '## Parser note',
  '',
  analysis.deepParserNeeded
    ? 'Deep parsing is marked as needed because Korg SET internals include proprietary subformats.'
    : 'Deep parsing was not required.'
];

await fs.writeFile(path.join(docsDir, 'sar-set-notes.md'), `${notes.join('\n')}\n`);
console.log(`Wrote ${path.join(docsDir, 'sar-set-analysis.json')}`);
console.log(`Wrote ${path.join(docsDir, 'sar-set-notes.md')}`);
