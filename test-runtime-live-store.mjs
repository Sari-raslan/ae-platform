import {
  updateRuntimeAnalysis,
  getRuntimeSnapshot,
  executeRuntimeCommand,
} from "./backend/src/runtime/runtimeLiveStore.js";

const snapshot = updateRuntimeAnalysis({
  setName: "sar.SET",
  styleBankCatalog: {
    banks: {
      A: {
        slots: {
          "1": {
            primaryEntry: {
              fileName: "STYLE_A.STY",
              bank: "A",
              slot: 1,
            },
            slotEntries: [
              {
                fileName: "STYLE_A.STY",
                bank: "A",
                slot: 1,
              },
            ],
          },
        },
      },
    },
  },
});

const status = getRuntimeSnapshot();
const started = executeRuntimeCommand({ type: "start" });
const stopped = executeRuntimeCommand({ type: "stop" });

console.log(JSON.stringify({ snapshot, status, started, stopped }, null, 2));

if (!snapshot.ok) throw new Error("Snapshot failed");
if (!status.runtimeResponse.ok) throw new Error("Runtime response failed");
if (!started.ok) throw new Error("Start failed");
if (!stopped.ok) throw new Error("Stop failed");

console.log("Runtime live store test passed");
