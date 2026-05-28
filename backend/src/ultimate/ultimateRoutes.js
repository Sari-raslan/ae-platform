const express = require("express");
const router = express.Router();

const { smartAnalyze } = require("./aiEngine");
const { listDevices } = require("./midiEngine");
const { cloudInfo } = require("./cloudEngine");

router.get("/status", (req, res) => {
  res.json(cloudInfo());
});

router.get("/midi", (req, res) => {
  try {
    res.json(listDevices());
  } catch (err) {
    res.status(500).json({
      ok:false,
      error:err.message
    });
  }
});

router.post("/analyze", express.json(), (req, res) => {
  try {
    res.json({
      ok:true,
      result:smartAnalyze(req.body || {})
    });
  } catch (err) {
    res.status(500).json({
      ok:false,
      error:err.message
    });
  }
});

module.exports = router;
