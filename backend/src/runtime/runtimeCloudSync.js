export function createCloudSync() {
  const syncs = [];

  function push(data = {}) {
    const item = {
      id: `sync-${syncs.length + 1}`,
      status: "uploaded",
      createdAt: new Date().toISOString(),
    };

    syncs.push(item);

    return item;
  }

  function snapshot() {
    return {
      ok: true,
      syncs,
      syncCount: syncs.length,
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    push,
    snapshot,
  };
}
