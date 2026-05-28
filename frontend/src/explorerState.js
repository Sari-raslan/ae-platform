const ARRANGER_EXTENSIONS = ['.sty', '.set', '.pcg', '.kst', '.pad', '.prs', '.all', '.bkp', '.pkg'];

export function createExplorerState({
  library = [],
  selectedId = null,
  query = '',
  category = 'ALL',
  sortKey = 'name',
  sortDirection = 'asc'
} = {}) {
  const rows = Array.isArray(library) ? library : [];

  const scopedRows = rows;

  const normalizedQuery = String(query || '').trim().toLowerCase();

  const searchedRows = normalizedQuery
    ? scopedRows.filter((row) => {
        const searchable = [
          row.id,
          row.name,
          row.fileName,
          row.path,
          row.relativePath,
          row.extension,
          row.ext,
          row.category,
          row.detectedType,
          row.type
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        return searchable.includes(normalizedQuery);
      })
    : scopedRows;

  const categorizedRows =
    category && category !== 'ALL'
      ? searchedRows.filter((row) => String(row.category || row.detectedType || 'UNKNOWN') === category)
      : searchedRows;

  const sortedRows = [...categorizedRows].sort((a, b) => {
    const av = a?.[sortKey] ?? '';
    const bv = b?.[sortKey] ?? '';

    if (typeof av === 'number' && typeof bv === 'number') {
      return sortDirection === 'asc' ? av - bv : bv - av;
    }

    return sortDirection === 'asc'
      ? String(av).localeCompare(String(bv))
      : String(bv).localeCompare(String(av));
  });

  const counts = sortedRows.reduce(
    (acc, row) => {
      const key = row.category || row.detectedType || 'UNKNOWN';
      acc.total += 1;
      acc.categories[key] = (acc.categories[key] || 0) + 1;
      acc.size += Number(row.size || 0);
      return acc;
    },
    { total: 0, size: 0, categories: {} }
  );

  const selectedRow = selectedId
    ? rows.find((row) => String(row.id) === String(selectedId) || String(row.path) === String(selectedId))
    : null;

  return {
    rawRows: rows,
    scopedRows,
    visibleRows: sortedRows,
    counts,
    selectedRow
  };
}

export function selectExplorerState(library, options = {}) {
  const {
    selectedId = null,
    query = '',
    category = 'all',
    sort = { key: 'name', direction: 'asc' },
    expanded = {},
    selectedAnalysis = null
  } = options;
  const normalizedQuery = query.trim().toLowerCase();
  const allRows = library.map((item) => {
    const pathSegments = String(item.id || item.name).split('/').filter(Boolean);
    const extension = getExtension(item);
    const categoryKey = getExplorerCategoryKey(item, extension);
    const categoryLabel = getExplorerCategoryLabel(categoryKey);
    const treeRoot = pathSegments[0] || item.id;
    const canExpand = pathSegments.length > 1 || item.isDirectory;
    const searchText = buildExplorerSearchText(item, { extension, categoryKey, categoryLabel, selectedAnalysis });
    const pathText = item.path || item.id || item.name;
    return {
      ...item,
      pathSegments,
      treeRoot,
      canExpand,
      isExpanded: expanded[treeRoot] !== false,
      depth: Math.max(pathSegments.length - 1, 0),
      extension,
      category: categoryKey,
      categoryLabel,
      kindLabel: item.isDirectory ? 'SET folder' : formatBytes(item.size),
      isSelected: item.id === selectedId,
      pathText,
      metadataText: buildMetadataText(item, { extension, categoryLabel }),
      searchText
    };
  });
  const categoryCounts = buildCategoryCounts(allRows);
  const filteredRows = allRows.filter((item) => {
    if (category !== 'all' && item.category !== category) return false;
    if (normalizedQuery && !item.searchText.includes(normalizedQuery)) return false;
    return item.treeRoot === item.id || expanded[item.treeRoot] !== false;
  });
  const rows = sortExplorerRows(filteredRows, sort);
  const totalBytes = rows.reduce((sum, item) => sum + (item.size || 0), 0);
  const selectedRow = allRows.find((item) => item.isSelected) || null;
  return {
    rows,
    selectedRow,
    categoryCounts,
    treeRoots: buildTreeRoots(allRows),
    stats: {
      totalCount: allRows.length,
      visibleCount: rows.length,
      totalBytes
    }
  };
}

function getExtension(item) {
  const name = item.name || item.id || '';
  const match = String(name).match(/(\.[^.\\/]+)$/);
  return match?.[1]?.toLowerCase() || '';
}

function getExplorerCategoryKey(item, extension) {
  if (item.isDirectory || ARRANGER_EXTENSIONS.includes(extension)) return 'arranger';
  if (extension === '.mid' || extension === '.midi') return 'midi';
  if (extension === '.syx') return 'sysex';
  return 'binary';
}

function getExplorerCategoryLabel(category) {
  return {
    all: 'All',
    arranger: 'Arranger',
    midi: 'MIDI',
    sysex: 'SysEx',
    binary: 'Binary'
  }[category] || 'Binary';
}

function buildCategoryCounts(rows) {
  const counts = rows.reduce((out, row) => {
    out[row.category] = (out[row.category] || 0) + 1;
    return out;
  }, { all: rows.length });
  return ['all', 'arranger', 'midi', 'sysex', 'binary'].map((key) => ({
    key,
    label: getExplorerCategoryLabel(key),
    count: counts[key] || 0
  }));
}

function buildTreeRoots(rows) {
  const roots = new Map();
  rows.forEach((row) => {
    if (!roots.has(row.treeRoot)) roots.set(row.treeRoot, { id: row.treeRoot });
  });
  return [...roots.values()];
}

function sortExplorerRows(rows, sort) {
  const direction = sort.direction === 'desc' ? -1 : 1;
  return [...rows].sort((a, b) => {
    if (sort.key === 'size') return ((a.size || 0) - (b.size || 0)) * direction;
    if (sort.key === 'updatedAt') return (new Date(a.updatedAt || 0) - new Date(b.updatedAt || 0)) * direction;
    if (sort.key === 'category') return a.categoryLabel.localeCompare(b.categoryLabel) * direction || a.name.localeCompare(b.name);
    return a.name.localeCompare(b.name) * direction;
  });
}

function buildMetadataText(item, details) {
  return JSON.stringify({
    id: item.id,
    name: item.name,
    path: item.path || item.id,
    category: details.categoryLabel,
    extension: details.extension || '[none]',
    size: item.size || 0,
    updatedAt: item.updatedAt || null,
    isDirectory: Boolean(item.isDirectory)
  }, null, 2);
}

function buildExplorerSearchText(item, details) {
  const values = [
    item.name,
    item.id,
    item.path,
    details.extension,
    details.categoryKey,
    details.categoryLabel,
    item.category,
    item.parser,
    item.possibleBrand
  ];

  if (details.selectedAnalysis?.id === item.id) {
    collectSearchCandidates(details.selectedAnalysis, values);
  }

  return values.filter(Boolean).join(' ').toLowerCase();
}

function collectSearchCandidates(value, out, depth = 0) {
  if (value == null || depth > 3) return;
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    out.push(String(value));
    return;
  }
  if (Array.isArray(value)) {
    value.slice(0, 80).forEach((item) => collectSearchCandidates(item, out, depth + 1));
    return;
  }
  if (typeof value === 'object') {
    Object.entries(value).forEach(([key, item]) => {
      out.push(key);
      collectSearchCandidates(item, out, depth + 1);
    });
  }
}

function formatBytes(bytes = 0) {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index ? 1 : 0)} ${units[index]}`;
}
