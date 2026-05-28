const fs = require("fs");
const path = require("path");

function autoTag(name) {
  const n = name.toLowerCase();

  if (n.includes("style")) return "STYLE";
  if (n.includes("pad")) return "PAD";
  if (n.includes("pcm")) return "PCM";
  if (n.includes("song")) return "SONGBOOK";
  if (n.includes("midi")) return "MIDI";
  if (n.includes("sound")) return "SOUND";

  return "UNKNOWN";
}

function smartAnalyze(entry) {
  return {
    aiCategory: autoTag(entry.name || ""),
    score: Math.floor(Math.random() * 100),
    recommended: true,
    analyzedAt: new Date().toISOString()
  };
}

module.exports = {
  smartAnalyze
};
