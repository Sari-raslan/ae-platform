export function buildPcmPreloadMap({ pcmDependencyDiagnostics = {} } = {}) {
  const links = pcmDependencyDiagnostics.links || [];
  const map = {};

  for (const link of links) {
    const styleName = link.style?.fileName || "unknown-style";
    if (!map[styleName]) map[styleName] = [];

    map[styleName].push({
      fileName: link.pcm?.fileName || null,
      relativePath: link.pcm?.relativePath || null,
      reference: link.reference || null,
    });
  }

  return {
    styleCount: Object.keys(map).length,
    map,
    generatedAt: new Date().toISOString(),
  };
}
