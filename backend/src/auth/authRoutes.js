import express from "express";
import { register, login, me } from "./authStore.js";

const router = express.Router();

router.post("/register", express.json(), (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ ok: false, error: "Email and password required" });

  res.json(register(email, password));
});

router.post("/login", express.json(), (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ ok: false, error: "Email and password required" });

  res.json(login(email, password));
});

router.get("/me", (req, res) => {
  const token = String(req.headers.authorization || "").replace("Bearer ", "");
  res.json(me(token));
});

router.get("/cloud-sync", (req, res) => {
  res.json({
    ok: true,
    mode: "local-cloud-ready",
    sync: "starter",
    message: "Cloud sync foundation ready"
  });
});

export default router;
