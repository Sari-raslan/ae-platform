import { buildStyleBankCatalog } from './backend/parsers/korg/styleBankCatalog.js';
import { analyzeStyleSlotDiagnostics } from './backend/parsers/korg/styleSlotDiagnostics.js';
import {
  summarizeStyleSlotResolution,
  resolveStyleSlotConflicts,
  formatStyleSlotReport,
} from './backend/parsers/korg/styleSlotResolution.js';

// Build test catalog with duplicates
const catalog = buildStyleBankCatalog([
  { fileName: "STYLE_A.STY", relativePath: "BANK_A", metadata: { bank: "A", slot: 1 }, size: 1000 },
  { fileName: "STYLE_B.STY", relativePath: "BANK_A", metadata: { bank: "A", slot: 1 }, size: 800 },
  { fileName: "STYLE_C.STY", relativePath: "BANK_A", metadata: { bank: "A", slot: 2 }, size: 900 },
  { fileName: "STYLE_D.STY", relativePath: "BANK_B", metadata: { bank: "B", slot: 5 }, size: 1200 },
]);

// Run diagnostics
const diagnostics = analyzeStyleSlotDiagnostics(catalog);

// Summary
console.log('=== SUMMARY ===');
const summary = summarizeStyleSlotResolution(diagnostics);
console.log(JSON.stringify(summary, null, 2));

// Resolution
console.log('\n=== RESOLUTION (keep-primary) ===');
const resolution = resolveStyleSlotConflicts(catalog, 'keep-primary');
console.log(JSON.stringify(resolution, null, 2));

// Full Report
console.log('\n=== FULL REPORT ===');
const report = formatStyleSlotReport(catalog, diagnostics);
console.log(JSON.stringify(report, null, 2));
