// backend/src/config/featureFlags.js
// Feature flags for safe, incremental parser expansion

export const FEATURE_FLAGS = {
  // Phase 3: Deep Korg Parser
  DEEP_STYLE_PARSER: process.env.DEEP_STYLE_PARSER === 'true' || false,
  REAL_BANK_EXTRACTION: process.env.REAL_BANK_EXTRACTION === 'true' || false,
  STYLE_CONFLICT_DETECTION: process.env.STYLE_CONFLICT_DETECTION === 'true' || false,
  SONGBOOK_LINKING: process.env.SONGBOOK_LINKING === 'true' || false,
  
  // Phase 4: Real Arranger Engine
  REALTIME_PREVIEW: process.env.REALTIME_PREVIEW === 'true' || false,
  MIDI_CLOCK_SYNC: process.env.MIDI_CLOCK_SYNC === 'true' || false,
  
  // Phase 5: Cloud
  CLOUD_SYNC: process.env.CLOUD_SYNC === 'true' || false,
};

export function isFeatureEnabled(flag) {
  return FEATURE_FLAGS[flag] === true;
}
