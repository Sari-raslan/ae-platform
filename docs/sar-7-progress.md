# SAR-7: Sortable Columns

Date: 2026-05-28

## Progress Update

- [x] Confirmed sort state is owned by `App`.
- [x] Confirmed sort controls cover name, category, size, and updated date.
- [x] Confirmed sorting is applied inside `selectExplorerState`.
- [x] Confirmed sort composes with debounced search, category chips, and tree expansion.
- [x] Added control styling coverage through the SAR-11 stylesheet pass.

## Regression Notes

- Sort toggles between ascending and descending when the active sort button is clicked.
- Sort does not mutate the source library array.
- Export links remain row-id based after sorting.
- Selection remains id-based after sorting.
- Web MIDI and parser pipeline were not changed.

## Verification Results

```powershell
cd C:\Users\ssare\keyboard-manager\frontend
cmd /c npm test
cmd /c npm run build
```

Result: passed.
