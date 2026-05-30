export function createLiveValidationPlan() {
  return {
    ok: true,
    title: "Live Runtime Validation Plan",
    tests: [
      "Upload real .SET",
      "Analyze STYLE banks",
      "Verify PCM dependencies",
      "Open runtime dashboard",
      "Check global runtime kernel",
      "Start runtime command flow",
      "Switch style preview",
      "Trigger transport state",
      "Inspect MIDI event bridge",
      "Save validation notes",
    ],
    exitCriteria: [
      "No backend crash",
      "Frontend renders runtime panels",
      "Parser returns integrity data",
      "Runtime APIs return ok:true",
      "Git tree remains clean",
    ],
    generatedAt: new Date().toISOString(),
  };
}
