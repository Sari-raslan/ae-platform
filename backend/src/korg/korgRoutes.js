import express from "express";
import path from "node:path";
import { parsePadBank } from "./padParser.js";
import { parseStyleBank } from "./styleParser.js";

const router = express.Router();

function defaultKorgSetPath() {
  return path.join(process.cwd(), "..", "samples", "Korg", "sar.SET");
}

router.get("/style-scan", (req, res) => {
  try {
    res.json(parseStyleBank(req.query.path || defaultKorgSetPath()));
  } catch (err) {
    res.status(500).json({
      ok: false,
      error: err.message
    });
  }
});

router.get("/pad-scan", (req, res) => {
  try {
    res.json(parsePadBank(req.query.path || defaultKorgSetPath()));
  } catch (err) {
    res.status(500).json({
      ok: false,
      error: err.message
    });
  }
});

export default router;
