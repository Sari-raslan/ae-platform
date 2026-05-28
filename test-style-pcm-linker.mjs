import { linkStylesToPcm } from "./backend/parsers/korg/stylePcmLinker.js";

const result = linkStylesToPcm({
  styleBankCatalog: {
    banks: {
      A: {
        slots: {
          "1": {
            slotEntries: [
              {
                fileName: "STYLE_A.STY",
                relativePath: "STYLE/BANK_A/STYLE_A.STY",
                pcmReferences: ["KICK_01.PCM", "MISSING_SAMPLE.PCM"],
              },
            ],
          },
        },
      },
    },
  },
  pcmFiles: [
    {
      fileName: "KICK_01.PCM",
      relativePath: "PCM/KICK_01.PCM",
    },
  ],
});

console.log(JSON.stringify(result, null, 2));

if (result.linkCount !== 1) {
  throw new Error("Expected 1 PCM link");
}

if (result.unresolvedCount !== 1) {
  throw new Error("Expected 1 unresolved PCM reference");
}

console.log("STYLE PCM linker test passed");
