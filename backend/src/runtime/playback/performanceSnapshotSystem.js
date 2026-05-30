export function createPerformanceSnapshotSystem() {
  const snapshots = [];

  function capture(data = {}) {
    const snapshot = {
      id: `snapshot-${snapshots.length + 1}`,
      state: data,
      createdAt: new Date().toISOString(),
    };

    snapshots.push(snapshot);

    return snapshot;
  }

  function latest() {
    return snapshots[snapshots.length - 1] || null;
  }

  function list() {
    return snapshots;
  }

  function snapshot() {
    return {
      ok: true,
      snapshots,
      snapshotCount: snapshots.length,
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    capture,
    latest,
    list,
    snapshot,
  };
}
