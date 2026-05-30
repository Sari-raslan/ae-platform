export function createRuntimeHealthGate({
  build = true,
  smoke = true,
  gitClean = true,
  runtimeReady = true,
} = {}) {
  const checks = [
    { id: "build", passed: build },
    { id: "smoke", passed: smoke },
    { id: "git-clean", passed: gitClean },
    { id: "runtime-ready", passed: runtimeReady },
  ];

  return {
    ok: checks.every((check) => check.passed),
    checks,
    status: checks.every((check) => check.passed)
      ? "release-candidate-ready"
      : "blocked",
    generatedAt: new Date().toISOString(),
  };
}
