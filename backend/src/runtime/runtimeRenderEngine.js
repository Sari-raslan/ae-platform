export function createRenderEngine() {
  const frames = [];

  function render(scene = {}) {
    const frame = {
      id: `frame-${frames.length + 1}`,
      scene: scene.name || "runtime-scene",
      renderedAt: new Date().toISOString(),
    };

    frames.push(frame);

    return frame;
  }

  function snapshot() {
    return {
      ok: true,
      frames,
      frameCount: frames.length,
      generatedAt: new Date().toISOString(),
    };
  }

  return {
    render,
    snapshot,
  };
}
