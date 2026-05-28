export function analyzePcmDependencies(pcmLinks = {}) {
  const unresolved = pcmLinks.unresolved || [];
  const links = pcmLinks.links || [];

  const missingByStyle = {};

  for (const item of unresolved) {
    const styleName =
      item.style?.fileName || "unknown-style";

    if (!missingByStyle[styleName]) {
      missingByStyle[styleName] = [];
    }

    missingByStyle[styleName].push(item.reference);
  }

  const heavilyDependentStyles = {};

  for (const link of links) {
    const styleName =
      link.style?.fileName || "unknown-style";

    if (!heavilyDependentStyles[styleName]) {
      heavilyDependentStyles[styleName] = 0;
    }

    heavilyDependentStyles[styleName] += 1;
  }

  return {
    totalLinks: links.length,
    unresolvedCount: unresolved.length,
    affectedStyles: Object.keys(missingByStyle).length,
    missingByStyle,
    heavilyDependentStyles,
    diagnostics: [
      {
        type: "pcm-dependency-analysis",
        level: unresolved.length > 0 ? "warn" : "info",
        message:
          unresolved.length > 0
            ? `PCM unresolved references: ${unresolved.length}`
            : "PCM dependency analysis clean",
      },
    ],
  };
}
