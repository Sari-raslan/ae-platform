import express from "express";
import path from "node:path";
import { scanKorgDeep } from "./deepKorgScanner.js";

const router = express.Router();

const {
  scanKorgStyleBanks
} = require("./styleBankExtractor");

function defaultSetPath() {
  return path.join(process.cwd(), "..", "samples", "Korg", "sar.SET");
}

router.get("/deep-scan", (req, res) => {
  try {
    res.json(scanKorgDeep(req.query.path || defaultSetPath()));
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

router.get("/style-scan", (req, res) => {
  try {
    const scan = scanKorgDeep(req.query.path || defaultSetPath());
    res.json({
      ok: scan.ok,
      parser: "korg-style-bank-safe-scanner",
      banks: scan.styleFiles?.length || 0,
      slotCandidates: (scan.styleFiles?.length || 0) * 32,
      files: scan.styleFiles || [],
      safety: scan.safety
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

router.get("/pad-scan", (req, res) => {
  try {
    const scan = scanKorgDeep(req.query.path || defaultSetPath());
    res.json({
      ok: scan.ok,
      parser: "korg-pad-safe-scanner",
      folderPresent: true,
      files: scan.padFiles?.length || 0,
      entries: scan.padFiles || [],
      safety: scan.safety
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

router.get("/sound-scan", (req, res) => {
  try {
    const scan = scanKorgDeep(req.query.path || defaultSetPath());
    res.json({
      ok: scan.ok,
      parser: "korg-sound-metadata-safe-scanner",
      files: scan.soundFiles?.length || 0,
      entries: scan.soundFiles || [],
      safety: scan.safety
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

router.get("/pcm-scan", (req, res) => {
  try {
    const scan = scanKorgDeep(req.query.path || defaultSetPath());
    res.json({
      ok: scan.ok,
      parser: "korg-pcm-metadata-safe-scanner",
      files: scan.pcmFiles?.length || 0,
      entries: scan.pcmFiles || [],
      safety: scan.safety
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

router.get("/songbook-scan", (req, res) => {
  try {
    const scan = scanKorgDeep(req.query.path || defaultSetPath());
    res.json({
      ok: scan.ok,
      parser: "korg-songbook-safe-scanner",
      files: scan.songBookFiles?.length || 0,
      entries: scan.songBookFiles || [],
      safety: scan.safety
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

router.get("/dependency-graph", (req, res) => {
  try {
    const scan = scanKorgDeep(req.query.path || defaultSetPath());
    res.json({
      ok: scan.ok,
      parser: "korg-set-dependency-safe-graph",
      dependencyGraph: scan.dependencyGraph
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;

router.get("/style-banks", (req, res) => {
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

    res.json(scanKorgStyleBanks(target));
  } catch (err) {
    res.status(500).json({
      ok: false,
      error: err.message
    });
  }
});
