import { getNextExecutionAgenda } from "./backend/parsers/korg/nextExecutionAgenda.js";

const agenda = getNextExecutionAgenda();

console.log(JSON.stringify(agenda, null, 2));

if (agenda.count < 5) {
  throw new Error("Expected at least 5 agenda tasks");
}

if (agenda.active.id !== "korg-integrity-api") {
  throw new Error("Expected Korg Integrity API as next task");
}

console.log("Next execution agenda test passed");
