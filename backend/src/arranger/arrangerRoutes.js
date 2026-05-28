import express from "express";
import { getStyles } from "./styles.js";
import {
  getEngineState,
  startPreview,
  stopPreview,
  setTempo,
  setSplitPoint,
  setRoutingProfile,
  setMidiClock
} from "./arrangerEngine.js";

const router = express.Router();

router.get("/styles", (req, res) => res.json(getStyles()));
router.get("/engine", (req, res) => res.json(getEngineState()));

router.get("/status", (req, res) => {
  res.json({
    ok: true,
    arranger: true,
    realtime: true,
    midiClock: true,
    engine: getEngineState().engine
  });
});

router.post("/preview/start", express.json(), (req, res) => {
  res.json(startPreview(req.body?.styleId, req.body?.tempo));
});

router.post("/preview/stop", (req, res) => res.json(stopPreview()));

router.post("/tempo", express.json(), (req, res) => res.json(setTempo(req.body?.tempo)));
router.post("/split", express.json(), (req, res) => res.json(setSplitPoint(req.body?.splitPoint)));
router.post("/routing", express.json(), (req, res) => res.json(setRoutingProfile(req.body?.routingProfile)));
router.post("/clock", express.json(), (req, res) => res.json(setMidiClock(req.body?.enabled)));

export default router;
