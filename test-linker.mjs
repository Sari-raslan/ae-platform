import { buildStyleBankCatalog } from './backend/parsers/korg/styleBankCatalog.js';
import {
  linkSongBookToStyles,
  summarizeSongBookStyleLinks,
  formatSongBookStyleReport,
} from './backend/parsers/korg/songBookStyleLinker.js';

// Build style catalog
const catalog = buildStyleBankCatalog([
  { fileName: "STYLE_ORIENTAL.STY", name: "Oriental Dance", metadata: { bank: "A", slot: 1 }, size: 1000 },
  { fileName: "STYLE_LATIN.STY", name: "Latin Groove", metadata: { bank: "A", slot: 2 }, size: 1200 },
  { fileName: "STYLE_POP.STY", name: "Pop Beat", metadata: { bank: "B", slot: 5 }, size: 900 },
]);

// Test song book entries
const songBook = [
  { title: "Song 1", styleBank: "A", styleSlot: 1 },  // Bank-slot match
  { title: "Song 2", styleName: "Latin Groove" },     // Name match
  { title: "Song 3", styleName: "Jazz Fusion" },      // No match
  { title: "Song 4", styleBank: "B", styleSlot: 5 },  // Bank-slot match
];

// Link songs to styles
const linkResult = linkSongBookToStyles(songBook, catalog);

console.log('=== LINK RESULT ===');
console.log(JSON.stringify(linkResult, null, 2));

console.log('\n=== SUMMARY ===');
const summary = summarizeSongBookStyleLinks(linkResult);
console.log(JSON.stringify(summary, null, 2));

console.log('\n=== FULL REPORT ===');
const report = formatSongBookStyleReport(linkResult);
console.log(JSON.stringify(report, null, 2));
