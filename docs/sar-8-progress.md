# SAR-8: Expand / Collapse All

Date: 2026-05-28

## Progress Update

- [x] Confirmed expansion state is owned by `App`.
- [x] Confirmed tree roots are derived by `selectExplorerState`.
- [x] Confirmed per-root expand/collapse controls are row scoped.
- [x] Confirmed Expand All and Collapse All use selector-derived tree roots.
- [x] Preserved current flat explorer behavior by deriving hierarchy from path roots only.

## Regression Notes

- Collapse hides rows under collapsed roots without clearing selection or detail state.
- Expand restores rows under expanded roots.
- Search, category chips, and sorting still run through `selectExplorerState`.
- Export links remain available for visible rows.
- Web MIDI and parser pipeline were not changed.

## Verification Results

```powershell
cd C:\Users\ssare\keyboard-manager\frontend
cmd /c npm test
cmd /c npm run build
```

Result: passed.
