export const KA_AGENTS = [
  {
    id: "ka-parser",
    name: "KA Parser Assistant",
    role: "Deep Korg parser, STYLE/PAD/SOUND/PCM/SongBook analysis",
    enabled: true,
  },
  {
    id: "ka-midi",
    name: "KA MIDI Assistant",
    role: "Web MIDI, backend MIDI fallback, routing and device checks",
    enabled: true,
  },
  {
    id: "ka-ui",
    name: "KA UI Assistant",
    role: "Explorer, dashboard, workstation and integrity UI",
    enabled: true,
  },
  {
    id: "ka-cloud",
    name: "KA Cloud Assistant",
    role: "Cloud sync, backups, remote libraries and validation",
    enabled: true,
  },
  {
    id: "ka-mobile",
    name: "KA Mobile Assistant",
    role: "Windows, Android, iOS and touch UI packaging",
    enabled: true,
  },
  {
    id: "ka-ai",
    name: "KA AI Assistant",
    role: "Repair suggestions, metadata enrichment and cleanup assistant",
    enabled: true,
  },
  {
    id: "ka-qa",
    name: "KA QA Assistant",
    role: "Build, smoke, regression and release checks",
    enabled: true,
  },
];

export function runKaMaestro({ analysis = {}, agenda = {} } = {}) {
  const activeAgents = KA_AGENTS.filter((agent) => agent.enabled);

  const tasks = [
    {
      agent: "ka-parser",
      task: "Continue Phase 3 parser intelligence",
      status: "ready",
      inputs: [
        "styleBankCatalog",
        "styleSlotDiagnostics",
        "songBookStyleLinks",
        "pcmDependencyDiagnostics",
      ],
    },
    {
      agent: "ka-ai",
      task: "Generate repair and cleanup intelligence",
      status: "ready",
      inputs: [
        "repairSuggestions",
        "repairPlan",
        "setIntegritySummary",
      ],
    },
    {
      agent: "ka-ui",
      task: "Prepare integrity dashboard view model",
      status: "ready",
      inputs: [
        "parserDashboardSummary",
        "integrityViewModel",
      ],
    },
    {
      agent: "ka-midi",
      task: "Preserve MIDI behavior and prepare routing profiles",
      status: "guarded",
      inputs: [
        "midiStatus",
        "arrangerRuntimePlan",
      ],
    },
    {
      agent: "ka-cloud",
      task: "Prepare integrity validation for future cloud sync",
      status: "queued",
      inputs: [
        "setIntegritySummary",
        "dependencyGraph",
      ],
    },
    {
      agent: "ka-mobile",
      task: "Track mobile/desktop packaging readiness",
      status: "queued",
      inputs: [
        "runtimePlan",
        "dashboardViewModel",
      ],
    },
    {
      agent: "ka-qa",
      task: "Require build and smoke verification after stable batch",
      status: "required",
      inputs: [
        "npm run build",
        "npm run smoke",
        "git status",
      ],
    },
  ];

  return {
    orchestrator: "KA Maestro",
    agentCount: activeAgents.length,
    agents: activeAgents,
    taskCount: tasks.length,
    tasks,
    projectStatus: analysis?.parserDashboardSummary?.status || "active",
    healthScore: analysis?.parserDashboardSummary?.healthScore ?? null,
    agenda,
    generatedAt: new Date().toISOString(),
  };
}
