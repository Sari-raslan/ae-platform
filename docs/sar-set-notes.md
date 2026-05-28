# sar.SET Safe Analysis

Analyzed at: 2026-05-28T08:17:32.955Z
Detected brand: Korg
Files inspected: 147
Total bytes: 259606448

This is a directory-based arranger keyboard set. The analyzer only extracts safe metadata, extension counts, short ASCII strings, and hex previews. It does not decode proprietary style, sound, PCM, or performance payloads.

## Extension counts

- .gbl: 1
- .kmp: 1
- .mxp: 1
- .pcg: 5
- .pcm: 99
- .prf: 16
- .sbd: 7
- .sbl: 1
- .sty: 15
- .voc: 1

## Korg parser summary

Parser: korg-set-safe-adapter
STYLE banks: 15
STYLE slot candidates: 480
STYLE bank families: FAVORITE, USER
PAD files: 0
PAD folder present: yes
SOUND banks: 5
PCM files indexed: 99
SongBook files: 8
SET graph nodes: 8
SET graph edges: 7
Payload decoded: no
Diagnostics: 1
Parser log entries: 6

The Phase 3 Korg adapter indexes proprietary containers, chunk candidates, strings, style slot candidates, counts, and sizes only. Unknown chunks are tolerated and PCM sample payloads are never decoded.

## Parser note

Deep parsing is marked as needed because Korg SET internals include proprietary subformats.
