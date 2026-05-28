import { analyzePcmDependencies } from "./backend/parsers/korg/pcmDependencyDiagnostics.js";

const result = analyzePcmDependencies({
  links: [
    {
      style: { fileName: "STYLE_A.STY" },
      pcm: { fileName: "KICK_01.PCM" },
    },
    {
      style: { fileName: "STYLE_A.STY" },
      pcm: { fileName: "SNARE_01.PCM" },
    },
  ],
  unresolved: [
    {
      style: { fileName: "STYLE_B.STY" },
      reference: "MISSING_PCM.PCM",
    },
  ],
});

console.log(JSON.stringify(result, null, 2));

if (result.totalLinks !== 2) {
  throw new Error("Expected 2 PCM links");
}

if (result.unresolvedCount !== 1) {
  throw new Error("Expected 1 unresolved PCM reference");
}

console.log("PCM dependency diagnostics test passed");
