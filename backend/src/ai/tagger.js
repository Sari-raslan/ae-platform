function detectCategory(name) {
  const n = name.toLowerCase();

  if (n.includes("style")) return "STYLE";
  if (n.includes("pad")) return "PAD";
  if (n.includes("pcm")) return "PCM";
  if (n.includes("song")) return "SONGBOOK";
  if (n.includes("midi")) return "MIDI";
  if (n.includes("sound")) return "SOUND";

  return "UNKNOWN";
}

function aiTags(entry) {
  const tags = [];

  const category = detectCategory(entry.name || "");

  tags.push(category);

  if ((entry.size || 0) > 1000000) {
    tags.push("LARGE");
  }

  if ((entry.strings || []).length > 20) {
    tags.push("RICH_METADATA");
  }

  return [...new Set(tags)];
}

module.exports = {
  aiTags
};
