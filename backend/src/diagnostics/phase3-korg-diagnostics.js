import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import KorgSetIndexer from '../parsers/korg/korgSetIndexer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Phase 3 Korg Diagnostics
 * Runs the Korg SET indexer on sample files and generates diagnostic report
 */

async function runPhase3KorgDiagnostics() {
  console.log('\n========================================');
  console.log('Phase 3: Deep Korg Parser Diagnostics');
  console.log('========================================\n');

  const startTime = Date.now();
  const report = {
    phase: 'Phase 3: Deep Korg Parser',
    timestamp: new Date().toISOString(),
    results: {},
    errors: [],
    timing: {}
  };

  try {
    // Step 1: Initialize Indexer
    console.log('[1/4] Initializing Korg SET Indexer...');
    const indexer = new KorgSetIndexer({
      debug: true,
      maxBufferSize: 1024 * 1024 * 50 // 50MB
    });
    console.log('✓ Indexer initialized\n');

    // Step 2: Index Korg sample directory
    console.log('[2/4] Indexing Korg sample directory...');
    const indexStartTime = Date.now();
    
    // Navigate up to root, then into samples
    const samplePath = path.resolve(__dirname, '../../../samples/Korg');
    console.log(`Target directory: ${samplePath}\n`);

    // Verify directory exists
    if (!fs.existsSync(samplePath)) {
      throw new Error(`Sample directory not found at: ${samplePath}`);
    }

    const index = await indexer.indexDirectory(samplePath);
    
    const indexTime = Date.now() - indexStartTime;
    report.timing.indexing = indexTime;
    report.results.index = index;

    console.log(`✓ Indexing completed in ${indexTime}ms`);
    console.log(`  Total files indexed: ${index.metadata.totalFiles}`);
    console.log(`  Total size: ${formatBytes(index.metadata.totalSize)}`);
    console.log(`  Korg files found: ${index.files.filter(f => f.isKorgFormat).length}\n`);

    // Step 3: Analyze statistics
    console.log('[3/4] Analyzing file statistics...');
    console.log('Files by type:');
    Object.entries(index.statistics.byType).forEach(([type, count]) => {
      console.log(`  ${type}: ${count}`);
    });
    console.log('Files by extension:');
    Object.entries(index.statistics.byExtension).forEach(([ext, count]) => {
      console.log(`  ${ext}: ${count}`);
    });
    console.log();

    // Step 4: Export index
    console.log('[4/4] Exporting Korg SET index...');
    const exportStartTime = Date.now();
    
    const outputDir = path.resolve(__dirname, '../../../docs');
    const outputPath = path.join(outputDir, 'phase3-korg-set-index.json');
    
    const exportResult = await indexer.exportToFile(outputPath);
    
    const exportTime = Date.now() - exportStartTime;
    report.timing.export = exportTime;

    if (exportResult.success) {
      console.log(`✓ Index exported successfully`);
      console.log(`  File: ${outputPath}`);
      console.log(`  Size: ${formatBytes(exportResult.size)}`);
      console.log(`  Time: ${exportTime}ms\n`);
    } else {
      throw new Error(`Export failed: ${exportResult.error}`);
    }

    // Summary
    const totalTime = Date.now() - startTime;
    report.timing.total = totalTime;
    report.success = true;

    console.log('========================================');
    console.log('Phase 3 Diagnostics: COMPLETED');
    console.log('========================================');
    console.log(`Total execution time: ${totalTime}ms`);
    console.log(`Index file: ${outputPath}`);
    console.log();

    return report;

  } catch (error) {
    const totalTime = Date.now() - startTime;
    report.timing.total = totalTime;
    report.success = false;
    report.errors.push({
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });

    console.error('\n========================================');
    console.error('ERROR: Phase 3 Diagnostics Failed');
    console.error('========================================');
    console.error(`Error: ${error.message}`);
    console.error(`Time: ${totalTime}ms\n`);

    throw error;
  }
}

/**
 * Helper function to format bytes to human-readable format
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

// Run diagnostics
runPhase3KorgDiagnostics()
  .then(report => {
    process.exit(0);
  })
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
