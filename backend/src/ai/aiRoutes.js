const express = require("express");
const router = express.Router();

const { aiTags } = require("../ai/tagger");
const { cloudStatus } = require("../cloud/status");

router.post("/tags", express.json(), (req, res) => {
  try {
    const entry = req.body || {};

    res.json({
      ok: true,
      tags: aiTags(entry)
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      error: err.message
    });
  }
});

router.get("/cloud", (req, res) => {
  res.json(cloudStatus());
});

module.exports = router;
