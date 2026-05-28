# SAR-12 + SAR-13: Regression Tests

Date: 2026-05-28

## Progress Update

- [x] Extracted explorer selector logic into `frontend/src/explorerState.js`.
- [x] Added `frontend/src/explorerState.test.mjs`.
- [x] Added `frontend` `npm test` script.
- [x] Covered category counts, debounced-search selector input, metadata/string candidates, stable hidden selection, sorting, collapse filtering, and copy metadata shape.

## Regression Notes

- Tests use Node built-in `assert`; no new framework dependency was added.
- Selector tests run without React or a browser.
- The React app imports the same selector module used by tests.
- Frontend build confirms the extracted selector still bundles correctly.

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
