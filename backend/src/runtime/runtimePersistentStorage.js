const database = {
  sessions: [],
  performances: [],
  presets: [],
};

export function createPersistentStorage() {
  function saveSession(session = {}) {
    const entry = {
      id: `session-${database.sessions.length + 1}`,
      ...session,
      savedAt: new Date().toISOString(),
    };

    database.sessions.push(entry);

    return entry;
  }

  function savePerformance(performance = {}) {
    const entry = {
      id: `performance-${database.performances.length + 1}`,
      ...performance,
      savedAt: new Date().toISOString(),
    };

    database.performances.push(entry);

    return entry;
  }

  function savePreset(preset = {}) {
    const entry = {
      id: `preset-${database.presets.length + 1}`,
      ...preset,
      savedAt: new Date().toISOString(),
    };

    database.presets.push(entry);

    return entry;
  }

  function snapshot() {
    return {
      ok: true,
      database,
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    saveSession,
    savePerformance,
    savePreset,
    snapshot,
  };
}
