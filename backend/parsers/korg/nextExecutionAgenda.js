export const NEXT_EXECUTION_AGENDA = [
  {
    id: "korg-integrity-api",
    phase: "Phase 3",
    title: "Korg Integrity API",
    status: "next",
    goal: "Expose parser dashboard, integrity score, repair suggestions, and unresolved resources.",
  },
  {
    id: "frontend-integrity-dashboard",
    phase: "Phase 3",
    title: "Frontend Integrity Dashboard",
    status: "queued",
    goal: "Show health score, STYLE conflicts, missing PCM, SongBook issues, and repair count.",
  },
  {
    id: "live-set-scan-trigger",
    phase: "Phase 3",
    title: "Live SET Scan Trigger",
    status: "queued",
    goal: "Trigger parser analysis and refresh diagnostics from the UI.",
  },
  {
    id: "repair-planner",
    phase: "Phase 3",
    title: "Repair Planner",
    status: "queued",
    goal: "Convert repair suggestions into actionable plans.",
  },
  {
    id: "arranger-runtime-groundwork",
    phase: "Phase 4",
    title: "Arranger Runtime Groundwork",
    status: "queued",
    goal: "Prepare preload planning, transport state, and routing foundations.",
  },
];

export function getNextExecutionAgenda() {
  return {
    count: NEXT_EXECUTION_AGENDA.length,
    active: NEXT_EXECUTION_AGENDA[0],
    tasks: NEXT_EXECUTION_AGENDA,
    generatedAt: new Date().toISOString(),
  };
}
