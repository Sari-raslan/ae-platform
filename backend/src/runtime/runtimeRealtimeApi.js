import {
  getRuntimeSnapshot,
  executeRuntimeCommand,
  updateRuntimeAnalysis,
} from "./runtimeLiveStore.js";

export function registerRealtimeRuntimeApi(app) {
  app.get("/api/runtime/state", async (req, res) => {
    try {
      res.json(getRuntimeSnapshot());
    } catch (error) {
      res.status(500).json({
        ok: false,
        error: error.message,
      });
    }
  });

  app.post("/api/runtime/command", async (req, res) => {
    try {
      const result = executeRuntimeCommand(req.body || {});
      res.json({
        ok: true,
        result,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        error: error.message,
      });
    }
  });

  app.post("/api/runtime/load-analysis", async (req, res) => {
    try {
      const snapshot = updateRuntimeAnalysis(req.body || {});
      res.json(snapshot);
    } catch (error) {
      res.status(500).json({
        ok: false,
        error: error.message,
      });
    }
  });
}
