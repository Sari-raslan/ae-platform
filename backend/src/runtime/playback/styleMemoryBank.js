export function createStyleMemoryBank() {
  const styles = new Map();

  function save(style = {}) {
    const id = style.id || `style-${styles.size + 1}`;

    const item = {
      id,
      name: style.name || id,
      tempo: style.tempo || 120,
      variation: style.variation || "VAR1",
      pads: style.pads || [],
      createdAt: new Date().toISOString(),
    };

    styles.set(id, item);

    return item;
  }

  function load(id) {
    return styles.get(id) || null;
  }

  function list() {
    return Array.from(styles.values());
  }

  function snapshot() {
    return {
      ok: true,
      styles: list(),
      styleCount: styles.size,
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    save,
    load,
    list,
    snapshot,
  };
}
