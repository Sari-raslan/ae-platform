export const CODEX_MASTER_AGENTS = [
  {
    id: "ka-parser",
    name: "KA Parser Assistant",
    mission: "Deep Korg parser expansion",
    detailedTasks: [
      "Expand STYLE bank/slot extraction",
      "Preserve STYLE slot duplicates",
      "Analyze STYLE slot conflicts",
      "Link SongBook entries to STYLE files",
      "Link STYLE files to PCM resources",
      "Expand SET dependency graph",
      "Prepare PAD/SOUND parser expansion",
    ],
  },
  {
    id: "ka-midi",
    name: "KA MIDI Assistant",
    mission: "MIDI and arranger runtime safety",
    detailedTasks: [
      "Preserve Web MIDI behavior",
      "Preserve backend MIDI fallback",
      "Prepare MIDI routing profiles",
      "Prepare MIDI clock sync foundation",
      "Prepare transport controls",
      "Prepare keyboard split planning",
    ],
  },
  {
    id: "ka-ui",
    name: "KA UI Assistant",
    mission: "Explorer and dashboard UI",
    detailedTasks: [
      "Preserve explorer/tree behavior",
      "Prepare integrity dashboard cards",
      "Prepare parser dashboard view model",
      "Prepare live SET scan trigger",
      "Prepare arranger runtime dashboard",
    ],
  },
  {
    id: "ka-cloud",
    name: "KA Cloud Assistant",
    mission: "Cloud sync and backup readiness",
    detailedTasks: [
      "Prepare cloud integrity validation",
      "Prepare remote library validation",
      "Prepare backup verification",
      "Prepare multi-device sync readiness",
    ],
  },
  {
    id: "ka-mobile",
    name: "KA Mobile Assistant",
    mission: "Mobile and desktop packaging",
    detailedTasks: [
      "Prepare Windows installer readiness",
      "Prepare Android APK readiness",
      "Prepare iOS build readiness",
      "Prepare touch UI requirements",
    ],
  },
  {
    id: "ka-ai",
    name: "KA AI Assistant",
    mission: "AI repair and cleanup intelligence",
    detailedTasks: [
      "Generate repair suggestions",
      "Build repair planner",
      "Prepare metadata enrichment",
      "Prepare auto categorization",
      "Prepare library cleanup assistant",
      "Prepare broken SET recovery workflow",
    ],
  },
  {
    id: "ka-qa",
    name: "KA QA Assistant",
    mission: "Verification and release safety",
    detailedTasks: [
      "Run npm build",
      "Run npm smoke",
      "Check git status",
      "Block commit on failed verification",
      "Protect parser/export/MIDI/explorer behavior",
    ],
  },
];

export function buildCodexAgentExecution(agent, context = {}) {
  return {
    agentId: agent.id,
    agentName: agent.name,
    mission: agent.mission,
    status: "ready",
    taskCount: agent.detailedTasks.length,
    tasks: agent.detailedTasks.map((task, index) => ({
      id: `${agent.id}-${index + 1}`,
      title: task,
      status: "planned",
      priority:
        agent.id === "ka-parser"
          ? "critical"
          : agent.id === "ka-qa"
            ? "required"
            : agent.id === "ka-midi"
              ? "guarded"
              : "normal",
    })),
    contextKeys: Object.keys(context),
  };
}

export function buildCodexMasterMission(context = {}) {
  const agentExecutions = CODEX_MASTER_AGENTS.map((agent) =>
    buildCodexAgentExecution(agent, context)
  );

  return {
    id: "codex-master-keyboard-manager-mission",
    title: "Codex Master Mission — Keyboard Manager",
    status: "ready",
    phase: "Phase 3 to Phase 4 Bridge",
    agentCount: agentExecutions.length,
    agents: agentExecutions,
    unifiedTask: {
      id: "unified-arranger-intelligence-foundation",
      title: "Build unified arranger intelligence foundation",
      description:
        "Use all KA agents together to continue parser intelligence, integrity diagnostics, repair planning, dashboard readiness, MIDI safety, cloud readiness, mobile readiness, AI cleanup, and QA verification as one coordinated mission.",
      executionOrder: [
        "ka-parser",
        "ka-ai",
        "ka-ui",
        "ka-midi",
        "ka-cloud",
        "ka-mobile",
        "ka-qa",
      ],
      requiredOutputs: [
        "parser diagnostics",
        "style dependency graph",
        "SongBook links",
        "PCM links",
        "repair plans",
        "integrity dashboard data",
        "runtime readiness plan",
        "verification report",
      ],
      requiredVerification: [
        "npm run build",
        "npm run smoke",
        "git status",
      ],
    },
    lockedRules: [
      "no full rewrite",
      "preserve export system",
      "preserve Web MIDI behavior",
      "preserve parser pipeline",
      "preserve explorer/tree behavior",
      "small reviewable patches only",
      "repo-grounded changes only",
      "verify before commit",
    ],
    generatedAt: new Date().toISOString(),
  };
}
