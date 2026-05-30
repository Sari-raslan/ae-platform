import { createRuntimeFinalReport } from "./backend/src/runtime/runtimeFinalReport.js";

const report = createRuntimeFinalReport();

console.log(JSON.stringify(report, null, 2));

if (!report.ok) throw new Error("Final report failed");
if (!report.releaseCandidate.ok) throw new Error("Release candidate failed");
if (!report.healthGate.ok) throw new Error("Health gate failed");
if (!report.validationPlan.ok) throw new Error("Validation plan failed");

console.log("Runtime final report test passed");
