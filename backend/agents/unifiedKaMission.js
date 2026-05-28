export const KA_AGENT_REGISTRY = [
  {
    id: "ka-parser",
    name: "KA Parser Assistant",
    domain: "Deep Korg Parser",
    responsibilities: [
      "STYLE bank and slot extraction",
      "PAD parser expansion",
      "SOUND metadata planning",
      "PCM scanner expansion",
      "SongBook parser expansion",
      "SET dependency graph expansion",
    ],
  },
  {
    id: "ka-midi",
    name: "KA MIDI Assistant",
    domain: "MIDI and Arranger Runtime",
    responsibilities: [
      "Preserve Web MIDI behavior",
      "Preserve backend MIDI fallback",
      "Prepare routing profiles",
      "Prepare MIDI clock sync groundwork",
      "Prepare transport state",
      "Prepare keyboard split planning",
    ],
  },
  {
    id: "ka-ui",
    name: "KA UI Assistant",
    domain: "Frontend Dashboard and Workstation",
    responsibilities: [
      "Preserve explorer tree behavior",
      "Expose parser dashboard summary",
      "Prepare integrity dashboard cards",
      "Prepare live scan trigger UI",
      "Prepare arranger runtime display",
    ],
  },
  {
    id: "ka-cloud",
    name: "KA Cloud Assistant",
    domain: "Cloud Production",
    responsibilities: [
      "Prepare cloud sync validation",
      "Prepare remote library validation",
      "Prepare backup integrity rules",
      "Prepare multi-device sync readiness",
    ],
  },
  {
    id: "ka-mobile",
    name: "KA Mobile Assistant",
    domain: "Mobile and Desktop Packaging",
    responsibilities: [
      "Track Windows installer readiness",
      "Track Android APK readiness",
      "Track iOS build readiness",
      "Prepare touch UI requirements",
    ],
  },
  {
    id: "ka-ai",
    name: "KA AI Assistant",
    domain: "AI Repair and Cleanup",
    responsibilities: [
      "Generate repair suggestions",
      "Prepare metadata enrichment",
      "Prepare auto categorization",
      "Prepare library cleanup assistant",
      "Prepare broken SET recovery recommendations",
    ],
  },
  {
    id: "ka-qa",
    name: "KA QA Assistant",
    domain: "Quality and Verification",
    responsibilities: [
      "Run npm build verification",
      "Run smoke verification",
      "Protect parser pipeline",
      "Protect export system",
      "Protect MIDI behavior",
      "Protect explorer regression behavior",
    ],
  },
];

function buildAgentTask(agent, context = {}) {
  return {
    agentId: agent.id,
    agentName: agent.name,
    domain: agent.domain,
    status: "planned",
    priority:
      agent.id === "ka-parser"
        ? "critical"
        : agent.id === "ka-qa"
          ? "required"
          : agent.id === "ka-midi"
            ? "guarded"
            : "normal",
    responsibilities: agent.responsibilities,
    inputs: {
      parserDashboardSummary: context.parserDashboardSummary || null,
      setIntegritySummary: context.setIntegritySummary || null,
      repairSuggestions: context.repairSuggestions || null,
      styleBankCatalog: context.styleBankCatalog || null,
      songBookStyleLinks: context.songBookStyleLinks || null,
      pcmDependencyDiagnostics: context.pcmDependencyDiagnostics || null,
      arrangerRuntimePlan: context.arrangerRuntimePlan || null,
    },
    outputsExpected:
      agent.id === "ka-parser"
        ? ["parser intelligence", "dependency graph", "diagnostics"]
        : agent.id === "ka-midi"
          ? ["routing plan", "runtime safety", "MIDI preservation"]
          : agent.id === "ka-ui"
            ? ["dashboard view model", "frontend cards", "scan trigger plan"]
            : agent.id === "ka-cloud"
              ? ["sync validation plan", "backup readiness"]
              : agent.id === "ka-mobile"
                ? ["packaging readiness plan"]
                : agent.id === "ka-ai"
                  ? ["repair plan", "cleanup suggestions"]
                  : ["build result", "smoke result", "regression guard"],
  };
}

export function executeUnifiedKeyboardManagerMission(context = {}) {
  const agentTasks = KA_AGENT_REGISTRY.map((agent) =>
    buildAgentTask(agent, context)
  );

  const unifiedMission = {
    id: "keyboard-manager-unified-mission",
    title: "Keyboard Manager Unified Execution Mission",
    status: "ready",
    phase: "Phase 3 to Phase 4 Bridge",
    lockedRules: [
      "no full rewrite",
      "preserve export system",
      "preserve Web MIDI behavior",
      "preserve parser pipeline",
      "preserve explorer/tree behavior",
      "keep changes small and reviewable",
      "repo-grounded changes only",
      "run build and smoke after stable batches",
      "commit after verification only",
    ],
    missionGoals: [
      "Finish deep Korg parser intelligence foundation",
      "Expose integrity and repair data",
      "Prepare frontend dashboard consumption",
      "Prepare arranger runtime planning",
      "Prepare cloud/mobile/AI expansion paths",
      "Verify every stable batch safely",
    ],
    agentsUsed: agentTasks.length,
    agentTasks,
    combinedExecutionPlan: [
      {
        step: 1,
        owner: "ka-parser",
        task: "Continue STYLE, SongBook, PCM, and dependency graph expansion",
      },
      {
        step: 2,
        owner: "ka-ai",
        task: "Convert diagnostics into repair and cleanup plans",
      },
      {
        step: 3,
        owner: "ka-ui",
        task: "Convert parser intelligence into dashboard-ready view models",
      },
      {
        step: 4,
        owner: "ka-midi",
        task: "Prepare arranger runtime while preserving existing MIDI behavior",
      },
      {
        step: 5,
        owner: "ka-cloud",
        task: "Prepare integrity validation for cloud sync and backups",
      },
      {
        step: 6,
        owner: "ka-mobile",
        task: "Track packaging and touch UI readiness",
      },
      {
        step: 7,
        owner: "ka-qa",
        task: "Run build, smoke, regression, and commit gate",
      },
    ],
    finalUnifiedTask: {
      title: "Build one safe arranger intelligence foundation",
      description:
        "Use all KA agents together to transform parser diagnostics, style dependencies, PCM links, SongBook links, repair suggestions, preload plans, and runtime readiness into one stable foundation for the next Keyboard Manager release.",
      requiredVerification: [
        "npm run build",
        "npm run smoke",
        "git status",
      ],
    },
    generatedAt: new Date().toISOString(),
  };

  return unifiedMission;
}
