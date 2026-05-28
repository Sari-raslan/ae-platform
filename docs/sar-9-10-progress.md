# SAR-9 + SAR-10: Copy Path + Copy Metadata

Date: 2026-05-28

## Progress Update

- [x] Confirmed Copy Path buttons use selector-derived `pathText`.
- [x] Confirmed Copy Metadata buttons use selector-derived `metadataText`.
- [x] Confirmed clipboard writes stay in the frontend only.
- [x] Confirmed metadata text includes id, name, path, category, extension, size, updatedAt, and directory flag.

## Regression Notes

- Copy Path and Copy Metadata do not change selection.
- Copy actions do not affect export URLs.
- Metadata text is generated from current row data and does not call the backend.
- Clipboard failures show an existing app error message instead of crashing.
- Web MIDI and parser pipeline were not changed.

## Verification Results

```powershell
cd C:\Users\ssare\keyboard-manager\frontend
cmd /c npm test
cmd /c npm run build
```

Result: passed.
