export const CODEX_EXECUTION_KERNEL = {
  program: "Keyboard Manager Codex",
  version: "0.2.0",
  mode: "unified-agent-execution",
  lockedRules: [
    "no full rewrite",
    "preserve export system",
    "preserve Web MIDI behavior",
    "preserve parser pipeline",
    "preserve explorer/tree behavior",
    "small reviewable patches only",
    "repo-grounded changes only",
    "build and smoke after stable batches",
    "commit only after verification",
  ],
};

export const CODEX_EXECUTION_AGENTS = [
  {
    id: "ka-parser",
    name: "KA Parser Assistant",
    phase: "Phase 3",
    domain: "Deep Korg Parser",
    tasks: [
      "STYLE bank and slot extraction",
      "STYLE duplicate preservation",
      "STYLE slot diagnostics",
      "STYLE conflict resolution summary",
      "SongBook STYLE linking",
      "STYLE PCM linking",
      "PCM dependency diagnostics",
      "SET integrity summary",
      "dependency graph expansion",
      "PAD/SOUND parser expansion planning",
    ],
  },
  {
    id: "ka-ai",
    name: "KA AI Assistant",
    phase: "Phase 7 groundwork",
    domain: "AI Repair and Cleanup",
    tasks: [
      "repair suggestion generation",
      "repair planner generation",
      "metadata enrichment planning",
      "auto categorization planning",
      "library cleanup assistant planning",
      "broken SET recovery planning",
    ],
  },
  {
    id: "ka-ui",
    name: "KA UI Assistant",
    phase: "Phase 3/4 bridge",
    domain: "Frontend Dashboard",
    tasks: [
      "integrity view model",
      "dashboard card preparation",
      "live scan trigger planning",
      "runtime status display planning",
      "explorer regression preservation",
    ],
  },
  {
    id: "ka-midi",
    name: "KA MIDI Assistant",
    phase: "Phase 4",
    domain: "MIDI Runtime",
    tasks: [
      "Web MIDI preservation",
      "backend MIDI fallback preservation",
      "routing profile planning",
      "MIDI clock sync groundwork",
      "transport control groundwork",
      "keyboard split groundwork",
    ],
  },
  {
    id: "ka-cloud",
    name: "KA Cloud Assistant",
    phase: "Phase 5",
    domain: "Cloud Production",
    tasks: [
      "cloud sync validation planning",
      "remote library integrity planning",
      "backup validation planning",
      "multi-device sync readiness",
      "future database readiness",
    ],
  },
  {
    id: "ka-mobile",
    name: "KA Mobile Assistant",
    phase: "Phase 6",
    domain: "Mobile/Desktop",
    tasks: [
      "Windows installer readiness",
      "Android APK readiness",
      "iOS build readiness",
      "touch UI requirements",
      "desktop runtime packaging planning",
    ],
  },
  {
    id: "ka-qa",
    name: "KA QA Assistant",
    phase: "All phases",
    domain: "Verification",
    tasks: [
      "npm run build",
      "npm run smoke",
      "git status",
      "regression guard",
      "commit gate",
      "push gate",
    ],
  },
];

function priorityForAgent(agentId) {
  if (agentId === "ka-parser") return "critical";
  if (agentId === "ka-qa") return "required";
  if (agentId === "ka-midi") return "guarded";
  return "normal";
}

export function buildCodexExecutionKernel(context = {}) {
  const agents = CODEX_EXECUTION_AGENTS.map((agent) => ({
    ...agent,
    priority: priorityForAgent(agent.id),
    taskCount: agent.tasks.length,
    detailedExecution: agent.tasks.map((task, index) => ({
      id: `${agent.id}-${String(index + 1).padStart(2, "0")}`,
      title: task,
      status: "planned",
      priority: priorityForAgent(agent.id),
    })),
  }));

  return {
    kernel: CODEX_EXECUTION_KERNEL,
    project: context.project || "Keyboard Manager",
    repository:
      context.repository || "Sari-raslan/Universal-Arranger-OS-Design",
    branch: context.branch || "main",
    status: "ready",
    agentCount: agents.length,
    agents,
    unifiedExecutionMission: {
      id: "codex-unified-keyboard-manager-execution",
      title: "Execute all KA agents as one unified Codex mission",
      objective:
        "Coordinate parser intelligence, repair planning, UI readiness, MIDI safety, cloud readiness, mobile readiness, AI cleanup, and QA verification into one release-safe execution plan.",
      executionOrder: [
        "ka-parser",
        "ka-ai",
        "ka-ui",
        "ka-midi",
        "ka-cloud",
        "ka-mobile",
        "ka-qa",
      ],
      requiredArtifacts: [
        "parserDashboardSummary",
        "setIntegritySummary",
        "repairPlan",
        "integrityViewModel",
        "arrangerRuntimePlan",
        "verificationReport",
      ],
      verificationCommands: [
        "npm run build",
        "npm run smoke",
        "git status",
      ],
    },
    generatedAt: new Date().toISOString(),
  };
}
