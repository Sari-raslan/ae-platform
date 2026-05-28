import express from "express";
import { listMidiDevices } from "../midi/deviceManager.js";
import midiRouter from "../midi/router.js";

const router = express.Router();

router.get("/devices", async (req, res) => {
  try {
    res.json(await listMidiDevices());
  } catch (err) {
    res.status(500).json({
      ok: false,
      error: err.message
    });
  }
});

router.post("/connect", express.json(), async (req, res) => {
  try {
    const inputPort = Number(req.body.inputPort || 0);
    const outputPort = Number(req.body.outputPort || 0);

    res.json(
      await midiRouter.connect(inputPort, outputPort)
    );
  } catch (err) {
    res.status(500).json({
      ok: false,
      error: err.message
    });
  }
});

export default router;
