# SAR-14: Smoke Test on sar.SET

Date: 2026-05-28

## Progress Update

- [x] Added missing backend smoke script at `backend/src/scripts/smoke.js`.
- [x] Reused the existing `backend` `npm run smoke` package script.
- [x] Smoke test analyzes `samples/Korg/sar.SET` through the real analyzer pipeline.
- [x] Smoke test validates directory analysis, Korg brand detection, deep parser flag, contained files, and extension counts.

## Regression Notes

- Smoke test does not mutate samples or docs.
- Smoke test uses local user-provided `samples/Korg/sar.SET`.
- Parser pipeline source files were not changed.
- Failure conditions throw explicit errors for CI/local runs.

## Verification Results

```powershell
cd C:\Users\ssare\keyboard-manager\backend
cmd /c npm run smoke
```

Result: passed.

Observed summary:

```json
{
  "ok": true,
  "id": "Korg/sar.SET",
  "brand": "Korg",
  "fileCount": 147,
  "size": 259606448,
  "extensionTypes": 10
}
```
