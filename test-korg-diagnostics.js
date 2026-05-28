const mod = require('./backend/parsers/korg/styleSlotDiagnostics.js');

console.log('Module:', mod);
console.log('Keys:', Object.keys(mod));
console.log('Has analyzeStyleSlotDiagnostics:', typeof mod.analyzeStyleSlotDiagnostics);

if (typeof mod.analyzeStyleSlotDiagnostics === 'function') {
  const result = mod.analyzeStyleSlotDiagnostics(
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
  console.log('\nDiagnostics Result:');
  console.log(JSON.stringify(result, null, 2));
} else {
  console.log('ERROR: Function not exported properly');
}
