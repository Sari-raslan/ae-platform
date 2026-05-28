import express from "express";
import { getStyles } from "./styles.js";

const router = express.Router();

router.get("/styles",(req,res)=>{
  res.json(getStyles());
});

router.get("/status",(req,res)=>{
  res.json({
    ok:true,
    arranger:true,
    realtime:true,
    midiClock:true
  });
});

export default router;
