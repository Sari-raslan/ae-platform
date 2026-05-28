import express from "express";
import multer from "multer";
import { analyzeMedia, quantizeMidiPlan, audioCleanupPlan } from "./hagelEngine.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/status", (req, res) => {
  res.json({
    ok: true,
    app: "Hagel Audio Manager",
    supports: ["MIDI quantization", "audio cleanup planning", "SysEx inspection"]
  });
});

router.post("/analyze", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ ok: false, error: "file required" });
  res.json(analyzeMedia({ fileName: req.file.originalname, size: req.file.size }));
});

router.post("/midi/quantize", express.json(), (req, res) => {
  res.json(quantizeMidiPlan({ grid: req.body?.grid || "1/16", strength: req.body?.strength || 100 }));
});

router.post("/audio/cleanup", express.json(), (req, res) => {
  res.json(audioCleanupPlan({ noiseReduction: req.body?.noiseReduction !== false, normalize: req.body?.normalize !== false }));
});

export default router;
