export const CODEX_AGENT_SYSTEM = {
  name: "Keyboard Manager Codex Program",
  version: "0.1.0",
  mission: "Use all KA agents to plan, execute, verify, and report Keyboard Manager development tasks safely.",
  lockedRules: [
    "no full rewrite",
    "preserve export system",
    "preserve Web MIDI behavior",
    "preserve parser pipeline",
    "preserve explorer/tree behavior",
    "small reviewable patches only",
    "repo-grounded changes only",
    "run build and smoke after stable batches",
    "commit only after verification",
  ],
};

export const CODEX_AGENTS = [
  {
    id: "ka-parser",
    name: "KA Parser Assistant",
    tasks: [
      "Expand Korg STYLE parser",
      "Track bank/slot catalog",
      "Analyze duplicate slots",
      "Link SongBook to STYLE",
      "Link STYLE to PCM",
      "Expand dependency graph",
    ],
  },
  {
    id: "ka-midi",
    name: "KA MIDI Assistant",
    tasks: [
      "Preserve Web MIDI",
      "Preserve backend MIDI fallback",
      "Prepare routing profiles",
      "Prepare MIDI clock sync",
      "Prepare transport controls",
    ],
  },
  {
    id: "ka-ui",
    name: "KA UI Assistant",
    tasks: [
      "Preserve explorer behavior",
      "Build integrity dashboard model",
      "Prepare dashboard cards",
      "Prepare live scan UI",
      "Prepare arranger runtime UI",
    ],
  },
  {
    id: "ka-cloud",
    name: "KA Cloud Assistant",
    tasks: [
      "Prepare cloud sync validation",
      "Prepare remote library checks",
      "Prepare backup integrity logic",
      "Prepare multi-device sync plan",
    ],
  },
  {
    id: "ka-mobile",
    name: "KA Mobile Assistant",
    tasks: [
      "Prepare Windows installer plan",
      "Prepare Android APK plan",
      "Prepare iOS build plan",
      "Prepare touch UI requirements",
    ],
  },
  {
    id: "ka-ai",
    name: "KA AI Assistant",
    tasks: [
      "Generate repair suggestions",
      "Prepare cleanup assistant",
      "Prepare metadata enrichment",
      "Prepare auto categorization",
      "Prepare broken SET recovery plan",
    ],
  },
  {
    id: "ka-qa",
    name: "KA QA Assistant",
    tasks: [
      "Run build verification",
      "Run smoke verification",
      "Check git status",
      "Protect parser/export/MIDI/explorer",
      "Approve commit only after stable batch",
    ],
  },
];

export function buildCodexAgentTask(agent, context = {}) {
  return {
    agentId: agent.id,
    agentName: agent.name,
    status: "ready",
    taskCount: agent.tasks.length,
    tasks: agent.tasks.map((task, index) => ({
      id: `${agent.id}-task-${index + 1}`,
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
    context,
  };
}

export function runCodexUnifiedProgram(context = {}) {
  const agentPlans = CODEX_AGENTS.map((agent) =>
    buildCodexAgentTask(agent, context)
  );

  return {
    program: CODEX_AGENT_SYSTEM,
    status: "ready",
    agentCount: CODEX_AGENTS.length,
    agentPlans,
    unifiedMission: {
      id: "codex-keyboard-manager-unified-task",
      title: "Execute all Keyboard Manager agents as one coordinated development mission",
      phase: "Phase 3 to Phase 4 Bridge",
      goal: "Combine parser intelligence, MIDI safety, UI dashboard readiness, cloud validation, mobile readiness, AI repair planning, and QA verification into one stable release foundation.",
      executionOrder: [
        "KA Parser Assistant",
        "KA AI Assistant",
        "KA UI Assistant",
        "KA MIDI Assistant",
        "KA Cloud Assistant",
        "KA Mobile Assistant",
        "KA QA Assistant",
      ],
      requiredVerification: [
        "npm run build",
        "npm run smoke",
        "git status",
      ],
    },
    generatedAt: new Date().toISOString(),
  };
}
