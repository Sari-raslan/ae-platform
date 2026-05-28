# SAR-11: Category Chips + Counts

Date: 2026-05-28

## Progress Update

- [x] Confirmed category state is owned by `App`.
- [x] Confirmed category chips are rendered from selector-derived `categoryCounts`.
- [x] Confirmed counts are derived from explorer rows, not hardcoded UI state.
- [x] Confirmed category filtering stays inside `selectExplorerState`.
- [x] Added missing chip and explorer-control styling.
- [x] Preserved debounced search behavior from SAR-6.
- [x] Preserved export URL behavior.
- [x] Preserved Web MIDI code path.
- [x] Preserved parser pipeline.

## Files Touched

- `frontend/src/styles.css`
- `frontend/dist/index.html`
- `frontend/dist/assets/index-BuJlvjLi.css`
- `frontend/dist/assets/index-DjrSEbBl.js`
- `docs/sar-11-progress.md`

Existing SAR-11-relevant logic was already present in `frontend/src/main.jsx`; no additional source edit was needed there during this pass.

## Regression Notes

- Category chips show `All`, `Arranger`, `MIDI`, `SysEx`, and `Binary` counts from `buildCategoryCounts`.
- Selecting a chip filters visible rows through `selectExplorerState`.
- Search and category filters compose together.
- Dashboard visible count and storage total remain derived from visible rows.
- Selection is not cleared when a category filter hides the selected row.
- Export remains row-id based and independent of selection.
- Web MIDI and backend parser files were not changed.
- CSS now supports the wider explorer row controls already present for sort, tree, copy, export, and delete.

## Verification Results

```powershell
cd C:\Users\ssare\keyboard-manager\frontend
cmd /c npm run build
```

Result: passed.
