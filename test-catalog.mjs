import { buildStyleBankCatalog } from './backend/parsers/korg/styleBankCatalog.js';

const catalog = buildStyleBankCatalog([
  {
    fileName: "STYLE_A.STY",
    relativePath: "BANK_A",
    metadata: { bank: "A", slot: 1 },
  },
  {
    fileName: "STYLE_B.STY",
    relativePath: "BANK_A",
    metadata: { bank: "A", slot: 1 },
  },
]);

console.log('Catalog Summary:');
console.log(`Banks: ${catalog.bankCount}`);
console.log(`Styles: ${catalog.styleCount}`);
console.log(`Assigned: ${catalog.assignedCount}`);
console.log(`Unassigned: ${catalog.unassignedCount}`);
console.log('\nSlot 1 Details (Bank A):');
console.log(JSON.stringify(catalog.banks.A.slots["1"], null, 2));
