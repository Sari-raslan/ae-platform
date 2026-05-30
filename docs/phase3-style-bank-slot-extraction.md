# Phase 3 — STYLE Bank + Slot Extraction

Status:
Started safe STYLE bank/slot extraction.

Implemented:
- safe recursive SET scan
- style bank candidate detection
- family classification
- slot candidate estimation
- ASCII string candidate extraction
- diagnostics endpoint

Endpoint:
GET /api/korg/style-banks

Rules preserved:
- no sample decoding
- no destructive rewrite
- export untouched
- Web MIDI untouched
- explorer untouched
- parser pipeline preserved
