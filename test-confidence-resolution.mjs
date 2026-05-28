import { buildStyleBankCatalog } from './backend/parsers/korg/styleBankCatalog.js';
import {
  normalizeStyleName,
  calculateNameSimilarity,
  scoreNameMatch,
  findBestNameMatch,
} from './backend/parsers/korg/styleNameNormalizer.js';
import {
  createStyleLink,
  createSongBookLink,
  summarizeLinkQuality,
} from './backend/parsers/korg/linkSourceMetadata.js';
import {
  analyzeOrphans,
  analyzeUnusedStyles,
  analyzeBrokenReferences,
  generateLinkQualityReport,
} from './backend/parsers/korg/linkQualityAnalyzer.js';
import {
  resolveConflictDeterministic,
  resolveDuplicateStyleSlots,
} from './backend/parsers/korg/songBookLinkResolver.js';

console.log('=== TESTING CONFIDENCE SCORING & CONFLICT RESOLUTION ===\n');

// Build test catalog
const catalog = buildStyleBankCatalog([
  { fileName: "STYLE_ORIENTAL.STY", name: "Oriental Dance", metadata: { bank: "A", slot: 1 }, size: 1000 },
  { fileName: "STYLE_LATIN.STY", name: "Latin Groove", metadata: { bank: "A", slot: 2 }, size: 1200 },
  { fileName: "STYLE_LATIN_ALT.STY", name: "Latin Groove Alt", metadata: { bank: "A", slot: 2 }, size: 800 },
  { fileName: "STYLE_POP.STY", name: "Pop Beat", metadata: { bank: "B", slot: 5 }, size: 900 },
]);

console.log('1. NAME NORMALIZATION & SIMILARITY\n');
const similarity = calculateNameSimilarity("Latin Groove", "Latin Groove Alt");
console.log(`Similarity between "Latin Groove" and "Latin Groove Alt": ${(similarity * 100).toFixed(1)}%`);

const match = scoreNameMatch("Latin Groove", "Latin Groove Alt");
console.log(`Match score: ${JSON.stringify(match, null, 2)}`);

console.log('\n2. STYLE LINKS WITH CONFIDENCE\n');
const allStyles = Object.values(catalog.banks || {})
  .flatMap(b => Object.values(b.slots || {})
    .flatMap(s => s.slotEntries || [s.primaryEntry]));

const styleLink1 = createStyleLink(allStyles[0], "bank-slot", 1.0);
console.log(`Bank-slot match: ${JSON.stringify(styleLink1, null, 2)}`);

console.log('\n3. SONGBOOK LINKS WITH METADATA\n');
const songs = [
  { id: "1", title: "Song 1", styleBank: "A", styleSlot: 1 },
  { id: "2", title: "Song 2", styleName: "Latin Groove" },
  { id: "3", title: "Song 3", styleName: "Jazz Fusion" },
];

const links = [
  createSongBookLink(songs[0], styleLink1, "exact"),
  createSongBookLink(songs[1], createStyleLink(allStyles[1], "fuzzy-name", 0.95), "high"),
  createSongBookLink(songs[2], null, "broken"),
];

console.log(`Created ${links.length} song-to-style links with quality metadata`);
console.log(`Link 1: ${links[0].quality} - ${links[0].styleLink.fileName}`);
console.log(`Link 2: ${links[1].quality} - ${links[1].styleLink.fileName}`);
console.log(`Link 3: ${links[2].quality} - broken (no style found)`);

console.log('\n4. LINK QUALITY SUMMARY\n');
const qualitySummary = summarizeLinkQuality(links);
console.log(JSON.stringify(qualitySummary, null, 2));

console.log('\n5. ORPHAN & UNUSED DETECTION\n');
const orphans = analyzeOrphans(songs, links);
console.log(`Orphaned songs: ${orphans.unlinkedCount}`);
console.log(JSON.stringify(orphans.unlinkedSongs, null, 2));

const unused = analyzeUnusedStyles(allStyles, links);
console.log(`\nUnused styles: ${unused.unusedCount}`);
console.log(JSON.stringify(unused.unusedStyles, null, 2));

console.log('\n6. CONFLICT RESOLUTION\n');
const duplicateResolutions = resolveDuplicateStyleSlots(catalog, "keep-primary");
console.log(JSON.stringify(duplicateResolutions, null, 2));

console.log('\n7. FULL QUALITY REPORT\n');
const fullReport = generateLinkQualityReport(songs, allStyles, links);
console.log(JSON.stringify(fullReport, null, 2));

console.log('\n✓ All confidence scoring and resolution tests complete!');
