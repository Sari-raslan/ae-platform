const express = require("express");
const router = express.Router();

const { getStyles } = require("./styles");

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

module.exports = router;
