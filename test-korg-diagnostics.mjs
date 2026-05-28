import { analyzeStyleSlotDiagnostics } from './backend/parsers/korg/styleSlotDiagnostics.js';

console.log('Testing Korg Style Slot Diagnostics...\n');

// Test case 1: No conflicts
const result1 = analyzeStyleSlotDiagnostics(
  {
    banks: {
      A: {
        slots: {
          '1': { fileName: 'STYLE_001.STY' },
          '3': { fileName: 'STYLE_003.STY' }
        }
      }
    }
  },
  { maxSlot: 4 }
);
console.log('Test 1 (no conflicts):');
console.log(JSON.stringify(result1, null, 2));

// Test case 2: With conflicts
const result2 = analyzeStyleSlotDiagnostics(
  {
    banks: {
      A: {
        slots: {
          '1': { fileName: 'STYLE_001A.STY' },
          '1': { fileName: 'STYLE_001B.STY' }
        }
      }
    }
  },
  { maxSlot: 5 }
);
console.log('\nTest 2 (missing catalog):');
const result3 = analyzeStyleSlotDiagnostics(null);
console.log(JSON.stringify(result3, null, 2));

console.log('\n✓ All tests passed!');
