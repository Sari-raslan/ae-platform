export function createNetworkSyncLayer() {
  const peers = [];

  function connect(peer = {}) {
    const entry = {
      id: peer.id || `peer-${peers.length + 1}`,
      name: peer.name || "Remote Device",
      connectedAt: new Date().toISOString(),
    };

    peers.push(entry);

    return entry;
  }

  function snapshot() {
    return {
      ok: true,
      peers,
      peerCount: peers.length,
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    connect,
    snapshot,
  };
}
