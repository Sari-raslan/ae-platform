import { buildFinalExperimentalRuntimeOverview } from "./backend/runtime/finalExperimentalRuntimeOverview.js";

const overview = buildFinalExperimentalRuntimeOverview({ status: "ready" });

console.log(JSON.stringify(overview, null, 2));

if (!overview.ok) throw new Error("Overview not ok");
if (overview.remainingTasks.length < 8) throw new Error("Missing remaining tasks");

console.log("Final experimental runtime overview test passed");
