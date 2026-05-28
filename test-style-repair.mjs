import { generateStyleRepairSuggestions } from "./backend/parsers/korg/styleRepairSuggestions.js";

const result = generateStyleRepairSuggestions({
  styleSlotDiagnostics: {
    conflicts: [
      {
        bank: "A",
        slot: 1,
        files: [
          { fileName: "STYLE_A.STY" },
          { fileName: "STYLE_B.STY" },
        ],
      },
    ],
  },
  pcmDependencyDiagnostics: {
    missingByStyle: {
      "STYLE_A.STY": [
        "MISSING_PCM_01.PCM",
      ],
    },
  },
  songBookStyleLinks: {
    unresolved: [
      {
        songBookEntry: {
          name: "Demo Song",
        },
      },
    ],
  },
});

console.log(JSON.stringify(result, null, 2));

if (result.suggestionCount !== 3) {
  throw new Error("Expected 3 repair suggestions");
}

console.log("STYLE repair suggestion test passed");
