import { bindAnalysisToLiveRuntime } from "./backend/src/runtime/runtimeBinding.js";
import { buildRuntimeApiResponse } from "./backend/src/runtime/runtimeApiResponse.js";

const analysis = {
  setName: "sar.SET",
  styleBankCatalog: {
    banks: {
      A: {
        slots: {
          "1": {
            primaryEntry: {
              fileName: "STYLE_A.STY",
              relativePath: "STYLE/BANK_A/STYLE_A.STY",
              bank: "A",
              slot: 1,
            },
            slotEntries: [
              {
                fileName: "STYLE_A.STY",
                relativePath: "STYLE/BANK_A/STYLE_A.STY",
                bank: "A",
                slot: 1,
              },
            ],
          },
        },
      },
    },
  },
  pcmDependencyDiagnostics: {
    links: [
      {
        pcm: {
          fileName: "KICK_01.PCM",
          relativePath: "PCM/KICK_01.PCM",
        },
      },
    ],
  },
  songBookStyleLinks: {
    links: [
      {
        songBookEntry: {
          name: "Demo Song",
        },
        style: {
          fileName: "STYLE_A.STY",
        },
      },
    ],
  },
};

const runtime = bindAnalysisToLiveRuntime(analysis);
const response = buildRuntimeApiResponse(analysis);

console.log(JSON.stringify({ runtime, response }, null, 2));

if (!runtime.ok) throw new Error("Runtime bind failed");
if (runtime.preload.styleQueueCount !== 1) throw new Error("Expected 1 style");
if (runtime.preload.pcmCacheCount !== 1) throw new Error("Expected 1 PCM");
if (!response.ok) throw new Error("Runtime API response failed");

console.log("Runtime binding test passed");
