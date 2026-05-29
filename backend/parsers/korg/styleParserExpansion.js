// backend/parsers/korg/styleParserExpansion.js
// Safe expansion of STYLE parser for real bank/slot extraction
// Additive only - does NOT modify existing parser pipeline

import { buildStyleBankCatalog } from './styleBankCatalog.js';
import { analyzeStyleSlotDiagnostics } from './styleSlotDiagnostics.js';
import { resolveDuplicateStyleSlots } from './songBookLinkResolver.js';

export function expandStyleParser(korgAnalysis = {}, options = {}) {
  const {
    enableBankExtraction = false,
    enableConflictDetection = false,
    conflictStrategy = 'keep-primary',
  } = options;

  if (!enableBankExtraction) {
    return null; // Feature disabled, return null for backward compatibility
  }

  try {
    const styleFiles = korgAnalysis.children || [];
    const filteredStyles = styleFiles.filter(f => 
      f.extension === '.sty' || f.category === 'style'
    );

    if (filteredStyles.length === 0) {
      return {
        ok: true,
        message: 'No STYLE files found',
        banks: {},
        diagnostics: [],
      };
    }

    // Build catalog from style files
    const catalog = buildStyleBankCatalog(filteredStyles);

    // Optional: detect conflicts
    let diagnostics = [];
    if (enableConflictDetection) {
      const slotDiagnostics = analyzeStyleSlotDiagnostics(catalog);
      const resolutions = resolveDuplicateStyleSlots(catalog, conflictStrategy);
      
      diagnostics = [
        {
          type: 'style-slot-diagnostics',
          level: slotDiagnostics.conflicts.length > 0 ? 'warn' : 'info',
          message: slotDiagnostics.diagnostics[0]?.message,
          data: slotDiagnostics,
        },
        {
          type: 'style-conflict-resolution',
          level: 'info',
          message: \Applied \ strategy to \ slot(s)\,
          data: resolutions,
        },
      ];
    }

    return {
      ok: true,
      message: 'STYLE parser expansion successful',
      catalog,
      diagnostics,
      stats: {
        bankCount: catalog.bankCount,
        styleCount: catalog.styleCount,
        assignedCount: catalog.assignedCount,
        unassignedCount: catalog.unassignedCount,
      },
    };
  } catch (error) {
    return {
      ok: false,
      error: error.message,
      message: 'STYLE parser expansion failed',
      diagnostics: [
        {
          type: 'style-expansion-error',
          level: 'error',
          message: error.message,
        },
      ],
    };
  }
}

export function integrateStyleExpansion(korgAnalysis, expansionResult) {
  if (!expansionResult || !expansionResult.ok) {
    return korgAnalysis; // Return unchanged if expansion failed
  }

  return {
    ...korgAnalysis,
    styleBankCatalog: expansionResult.catalog,
    styleExpansion: {
      enabled: true,
      stats: expansionResult.stats,
    },
    diagnostics: [
      ...(korgAnalysis.diagnostics || []),
      ...expansionResult.diagnostics,
    ],
  };
}
