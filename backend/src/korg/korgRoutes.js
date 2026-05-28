const express = require("express");
const router = express.Router();

const path = require("path");

const {
  parseStyleBank
} = require("./styleParser");

router.get("/style-scan", (req, res) => {

  try {

    const target =
      req.query.path ||
      path.join(
        process.cwd(),
        "..",
        "samples",
        "Korg",
        "sar.SET"
      );

    res.json(
      parseStyleBank(target)
    );

  } catch (err) {

    res.status(500).json({
      ok: false,
      error: err.message
    });

  }

});

module.exports = router;
