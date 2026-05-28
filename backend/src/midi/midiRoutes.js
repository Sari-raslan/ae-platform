const express = require("express");
const router = express.Router();

const { listMidiDevices } = require("../midi/deviceManager");
const midiRouter = require("../midi/router");

router.get("/devices", (req, res) => {
  try {
    res.json(listMidiDevices());
  } catch (err) {
    res.status(500).json({
      ok: false,
      error: err.message
    });
  }
});

router.post("/connect", express.json(), (req, res) => {
  try {
    const inputPort = Number(req.body.inputPort || 0);
    const outputPort = Number(req.body.outputPort || 0);

    res.json(
      midiRouter.connect(inputPort, outputPort)
    );
  } catch (err) {
    res.status(500).json({
      ok: false,
      error: err.message
    });
  }
});

module.exports = router;
