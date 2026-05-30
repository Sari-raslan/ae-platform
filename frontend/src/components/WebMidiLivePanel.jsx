import { useState } from "react";
import { decodeMidiMessage, requestWebMidiAccess } from "../midi/webMidiClient.js";

export default function WebMidiLivePanel() {
  const [state, setState] = useState({
    ok: false,
    connected: false,
    inputs: [],
    outputs: [],
    events: [],
    error: null,
  });

  async function connect() {
    try {
      const result = await requestWebMidiAccess();

      if (!result.ok) {
        setState((current) => ({
          ...current,
          ok: false,
          error: result.error,
        }));
        return;
      }

      for (const input of result.access.inputs.values()) {
        input.onmidimessage = (message) => {
          const decoded = decodeMidiMessage(message);

          setState((current) => ({
            ...current,
            events: [decoded, ...current.events].slice(0, 25),
          }));
        };
      }

      setState({
        ok

cd ~/universal-arranger-os

node - <<'EOF'
import fs from "fs";

const file = "frontend/src/main.jsx";
let content = fs.readFileSync(file, "utf8");

const panels = [
  "RuntimeControlCenter",
  "LiveArrangerConsole",
  "LivePerformanceCenter",
  "RuntimeMasterPanel",
  "RuntimeExecutionPanel",
  "FinalRuntimeKernelPanel",
  "GlobalRuntimeKernelPanel",
  "RuntimeFinalReportPanel",
  "UniverseKernelPanel",
  "InfiniteKernelPanel",
  "OmegaKernelPanel",
  "ApexKernelPanel",
  "SingularityKernelPanel"
];

for (const panel of panels) {
  content = content.replace(
    new RegExp(`\\n<${panel} />\\s*`, "g"),
    `\n// <${panel} /> disabled: must be rendered inside React tree\n`
  );
}

fs.writeFileSync(file, content);
