export function createArrangerPlaybackStateMachine(initial = {}) {
  let state = {
    status: initial.status || "stopped",
    tempo: initial.tempo || 120,
    styleId: initial.styleId || null,
    variation: initial.variation || "VAR1",
    pendingVariation: null,
    pendingFill: null,
    bar: 1,
    beat: 1,
    tick: 0,
    ppq: initial.ppq || 24,
    updatedAt: new Date().toISOString(),
  };

  function snapshot() {
    return
cd ~/universal-arranger-os

cat > backend/src/runtime/playback/arrangerPlaybackStateMachine.js <<'EOF'
export function createArrangerPlaybackStateMachine(initial = {}) {
  let state = {
    status: initial.status || "stopped",
    tempo: initial.tempo || 120,
    styleId: initial.styleId || null,
    variation: initial.variation || "VAR1",
    pendingVariation: null,
    pendingFill: null,
    bar: 1,
    beat: 1,
    tick:
