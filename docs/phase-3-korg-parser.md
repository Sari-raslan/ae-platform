# Phase 3: Deep Korg Parser

Date: 2026-05-28

## Batch Scope

- Added safe Korg parser adapters under `backend/src/parsers/korg.js`.
- Wired the adapter into `backend/src/services/analyzer.js`.
- Preserved explorer architecture, export routes, Web MIDI, and current frontend behavior.
- Kept parser work metadata-only: no copyrighted sample payload or musical payload decoding.

## Parser Coverage

- STYLE: scans `.STY` bank files for safe structure hints, chunk candidates, string/name candidates, and diagnostics.
- PAD: supports PAD scanner shape and reports an empty PAD folder safely when no files are present.
- SOUND: scans `.PCG` files for bank metadata, program-name candidates, chunk candidates, and structure hints.
- PCM: indexes `.PCM` files by id/name/size and total/min/max bytes without reading sample payloads.
- SongBook: scans `.SBD` and `.SBL` files for entry-name candidates, chunk candidates, and structure hints.
- Unknown chunks: tolerated as candidates only; malformed or unreadable files become diagnostics instead of crashes.

## Safety Rules

- `payloadDecoded` remains `false`.
- PCM audio/sample content is never decoded.
- Parser reads are capped for metadata scanning.
- Chunk scanners treat tags and lengths as heuristic candidates, not authoritative decoded structures.
- Directory-level Korg analysis sees the full SET file list, so late folders like STYLE/SOUND/SongBook are not missed by the existing child-summary cap.

## Smoke Notes

- `samples/Korg/sar.SET` analysis completed and regenerated `docs/sar-set-analysis.json`.
- Current sar.SET summary: 15 STYLE banks, 0 PAD files, 5 SOUND banks, 99 PCM files, 8 SongBook files.
- Frontend production build passed after parser changes.

## Next Batches

- Add fixture-level malformed binary checks for each adapter.
- Promote parser diagnostics into a compact UI section when the explorer UI is ready.
- Add richer Korg-specific structure recognition only where the format can be verified safely.
