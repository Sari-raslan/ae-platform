import assert from 'node:assert/strict';
import { createExplorerState, selectExplorerState } from './explorerState.js';

const library = [
  { id: 'Korg/sar.SET', name: 'sar.SET', isDirectory: true, size: 4096, updatedAt: '2026-05-27T08:00:00.000Z' },
  { id: 'uploads/song.mid', name: 'song.mid', isDirectory: false, size: 120, updatedAt: '2026-05-27T09:00:00.000Z' },
  { id: 'uploads/patch.syx', name: 'patch.syx', isDirectory: false, size: 80, updatedAt: '2026-05-27T10:00:00.000Z' },
  { id: 'uploads/blob.bin', name: 'blob.bin', isDirectory: false, size: 40, updatedAt: '2026-05-27T11:00:00.000Z' }
];

const selectedAnalysis = {
  id: 'Korg/sar.SET',
  possibleBrand: 'Korg',
  strings: ['Dabke Live Set'],
  metadata: { zeroByteRatio: 0.12 }
};

{
  const sharedLibrary = [
    { id: '1', name: 'A.STY', category: 'STYLE', size: 100 },
    { id: '2', name: 'B.PAD', category: 'PAD', size: 200 },
    { id: '3', name: 'C.PCG', category: 'SOUND', size: 300 }
  ];

  const state = createExplorerState({ library: sharedLibrary, selectedId: '2' });
  assert.equal(state.visibleRows.length, 3);
  assert.equal(state.counts.total, 3);
  assert.equal(state.counts.size, 600);
  assert.equal(state.counts.categories.STYLE, 1);
  assert.equal(state.selectedRow.name, 'B.PAD');

  const filtered = createExplorerState({ library: sharedLibrary, query: 'pad' });
  assert.equal(filtered.visibleRows.length, 1);
  assert.equal(filtered.visibleRows[0].name, 'B.PAD');

  const categorized = createExplorerState({ library: sharedLibrary, category: 'STYLE' });
  assert.equal(categorized.visibleRows.length, 1);
  assert.equal(categorized.visibleRows[0].category, 'STYLE');
}

{
  const state = selectExplorerState(library, { selectedId: 'Korg/sar.SET', selectedAnalysis });
  assert.equal(state.stats.totalCount, 4);
  assert.equal(state.stats.visibleCount, 4);
  assert.equal(state.selectedRow.id, 'Korg/sar.SET');
  assert.deepEqual(state.categoryCounts.map((item) => [item.key, item.count]), [
    ['all', 4],
    ['arranger', 1],
    ['midi', 1],
    ['sysex', 1],
    ['binary', 1]
  ]);
}

{
  const state = selectExplorerState(library, { query: 'dabke', selectedId: 'Korg/sar.SET', selectedAnalysis });
  assert.deepEqual(state.rows.map((row) => row.id), ['Korg/sar.SET']);
  assert.equal(state.selectedRow.id, 'Korg/sar.SET');
}

{
  const state = selectExplorerState(library, { category: 'midi' });
  assert.deepEqual(state.rows.map((row) => row.id), ['uploads/song.mid']);
  assert.equal(state.stats.visibleCount, 1);
  assert.equal(state.stats.totalBytes, 120);
}

{
  const state = selectExplorerState(library, { selectedId: 'uploads/blob.bin', category: 'midi' });
  assert.deepEqual(state.rows.map((row) => row.id), ['uploads/song.mid']);
  assert.equal(state.selectedRow.id, 'uploads/blob.bin');
}

{
  const state = selectExplorerState(library, { sort: { key: 'size', direction: 'desc' } });
  assert.deepEqual(state.rows.map((row) => row.id), ['Korg/sar.SET', 'uploads/song.mid', 'uploads/patch.syx', 'uploads/blob.bin']);
}

{
  const state = selectExplorerState(library, { expanded: { uploads: false } });
  assert.deepEqual(state.rows.map((row) => row.id), ['Korg/sar.SET']);
}

{
  const state = selectExplorerState(library, {});
  const metadata = JSON.parse(state.rows.find((row) => row.id === 'uploads/song.mid').metadataText);
  assert.equal(metadata.path, 'uploads/song.mid');
  assert.equal(metadata.category, 'MIDI');
}

console.log('Explorer state regression tests passed.');
