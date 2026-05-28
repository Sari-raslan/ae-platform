# Phase 2 Explorer/UI Core Progress

Date: 2026-05-28

This aggregate reflects the verified local state after SAR-11, SAR-7, SAR-8, SAR-9/10, SAR-12/13, and SAR-14 follow-up work.

## Completed Scope

- SAR-11: category chips and counts are derived from `selectExplorerState`.
- SAR-7: sort controls for name, category, size, and updated date are applied in `selectExplorerState`.
- SAR-8: per-root expand/collapse and Expand All / Collapse All use selector-derived tree roots.
- SAR-9: Copy Path uses selector-derived `pathText`.
- SAR-10: Copy Metadata uses selector-derived `metadataText`.
- SAR-12 + SAR-13: selector regression tests run through the new frontend `npm test` script.
- SAR-14: backend sar.SET smoke test runs through the existing backend `npm run smoke` script.

## Files Changed

- `frontend/package.json`
- `frontend/src/main.jsx`
- `frontend/src/styles.css`
- `frontend/src/explorerState.js`
- `frontend/src/explorerState.test.mjs`
- `backend/src/scripts/smoke.js`
- `frontend/dist/index.html`
- `frontend/dist/assets/index-B4-P1-4Z.css`
- `frontend/dist/assets/index-B39sU4Xd.js`
- `docs/sar-7-progress.md`
- `docs/sar-8-progress.md`
- `docs/sar-9-10-progress.md`
- `docs/sar-11-progress.md`
- `docs/sar-12-13-progress.md`
- `docs/sar-14-progress.md`
- `docs/sar-7-through-14-progress.md`

## Behavior Preserved

- Existing `/api/library`, `/api/library/:id`, `/api/export/:id`, upload, delete, and status routes remain in place.
- Parser pipeline still flows through `analyzePath`; parser source files were not changed.
- Export links remain row-scoped and independent of selected analysis.
- Web MIDI component was not moved or redesigned.
- Current library discovery logic and SET folder handling remain in `services/library.js`.

## Regression Notes

- Search, category, sorting, and expansion compose inside the shared explorer selector.
- Selection remains id-based and is not cleared when filtering or collapse hides the selected row.
- Dashboard visible count and storage total derive from visible selector rows.
- Clipboard actions depend on browser clipboard permission and secure-context behavior.
- Tree collapse is intentionally shallow and root-based until the backend exposes canonical nested explorer nodes.

## Verification Results

```powershell
cd C:\Users\ssare\keyboard-manager\frontend
cmd /c npm test
```

Result: passed. Output included `Explorer state regression tests passed.`

```powershell
cd C:\Users\ssare\keyboard-manager\frontend
cmd /c npm run build
```

Result: passed.

```powershell
cd C:\Users\ssare\keyboard-manager\backend
cmd /c npm run smoke
```

Result: passed with sar.SET summary:

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
