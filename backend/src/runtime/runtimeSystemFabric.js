export function createSystemFabric() {
  const channels = [];

  function attach(channel = {}) {
    const entry = {
      id: channel.id || `channel-${channels.length + 1}`,
      type: channel.type || "runtime-channel",
      attachedAt: new Date().toISOString(),
    };

    channels.push(entry);

    return entry;
  }

  function snapshot() {
    return {
      ok: true,
      channels,
      channelCount: channels.length,
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    attach,
    snapshot,
  };
}
