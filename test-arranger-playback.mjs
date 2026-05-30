import { createArrangerPlaybackStateMachine } from "./backend/src/runtime/playback/arrangerPlaybackStateMachine.js";

const playback = createArrangerPlaybackStateMachine();

playback.start();

for (let i = 0; i < 96; i++) playback.advanceTick();

const state = playback.snapshot();

console.log(JSON.stringify(state, null, 2));

if (state.status !== "playing") throw new Error("not playing");
if (state.bar !== 2) throw new Error("bar did not advance");

console.log("Playback state machine test passed");
