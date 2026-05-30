export function createStorageGateway() {
  const records = [];

  function write(record = {}) {
    const entry = {
      id: `record-${records.length + 1}`,
      ...record,
      createdAt: new Date().toISOString(),
    };

    records.push(entry);

    return entry;
  }

  function snapshot() {
    return {
      ok: true,
      records,
      recordCount: records.length,
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    write,
    snapshot,
  };
}
