// backend/parsers/korg/styleNameNormalizer.js

export function normalizeStyleName(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^a-z0-9\s]/g, "");
}

export function calculateNameSimilarity(str1, str2) {
  const s1 = normalizeStyleName(str1);
  const s2 = normalizeStyleName(str2);

  if (s1 === s2) return 1.0;
  if (!s1 || !s2) return 0;

  // Levenshtein distance algorithm
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;

  if (longer.length === 0) return 1.0;

  const editDistance = getEditDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

function getEditDistance(s1, s2) {
  const costs = [];

  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else if (j > 0) {
        let newValue = costs[j - 1];
        if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        }
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }

  return costs[s2.length];
}

export function scoreNameMatch(requestedName, styleName, threshold = 0.75) {
  const similarity = calculateNameSimilarity(requestedName, styleName);

  if (similarity === 1.0) {
    return {
      score: 1.0,
      type: "exact-match",
      confidence: "high",
    };
  }

  if (similarity >= threshold) {
    return {
      score: similarity,
      type: "fuzzy-match",
      confidence: similarity >= 0.9 ? "high" : "medium",
    };
  }

  return {
    score: similarity,
    type: "no-match",
    confidence: "low",
  };
}

export function buildNameIndex(styles = []) {
  const exactIndex = new Map();
  const fuzzyIndex = new Map();

  for (const style of styles) {
    const name = style.name || style.fileName;
    if (!name) continue;

    const normalized = normalizeStyleName(name);
    if (normalized) {
      exactIndex.set(normalized, style);
      fuzzyIndex.set(normalized, style);
    }
  }

  return { exactIndex, fuzzyIndex };
}

export function findBestNameMatch(requestedName, styles = [], threshold = 0.75) {
  const requestedNorm = normalizeStyleName(requestedName);
  let bestMatch = null;
  let bestScore = 0;

  for (const style of styles) {
    const styleName = style.name || style.fileName;
    if (!styleName) continue;

    const match = scoreNameMatch(requestedName, styleName, threshold);

    if (match.score > bestScore) {
      bestScore = match.score;
      bestMatch = {
        style,
        score: match.score,
        type: match.type,
        confidence: match.confidence,
      };
    }
  }

  return bestMatch;
}
