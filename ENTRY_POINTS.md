# Keyboard Manager — Application Entry Points & Architecture

## Backend Server

**File:** `backend/src/server.js`

### Main Entry Point
- **Line 37:** `const app = express();`
- **Line 188:** `app.listen(port, ...)` — Starts server on port 4000

### API Routes (app.get)
- **Line 47:** `/api/korg-integrity` — Korg SET analysis
- **Line 67:** `/api/status` — Health check
- **Line 86:** `/api/library` — List library items
- **Line 94:** `/api/library/:id` — Analyze library item
- **Line 105:** `/api/korg-set/index` — Korg SET index
- **Line 113:** `/api/korg-set/tree` — Korg SET tree
- **Line 121:** `/api/korg-set/export` — Export Korg SET
- **Line 131:** `/api/export/:id` — Export library item

### Middleware
- Line 38: `app.use(cors())`
- Line 39: `app.use(express.json())`
- Line 41-44: Mount auth, arranger, Korg routes

---

## Frontend Application

**File:** `frontend/src/main.jsx`

### React App Root
- **Line 25:** `function App()` — Main React component
- **Line 445:** `createRoot(document.getElementById('root')).render(<App />`

### Imported Dashboard Components
- **Line 4:** `UltimateDashboard` (ultimate/UltimateDashboard.jsx)
- **Line 5:** `ArrangerDashboard` (arranger/ArrangerDashboard.jsx)
- **Line 7:** `AIDashboard` (ai/AIDashboard.jsx)
- **Line 8:** `MidiDashboard` (MidiDashboard.jsx)

### Dashboard Rendering
- **Line 281:** `<MidiDashboard />`
- **Line 282:** `<AIDashboard />`
- **Line 284:** `<UltimateDashboard />`
- **Line 287:** `<ArrangerDashboard />`

---

## Dashboard Components

### 1. RuntimeOverviewPanel (NEW)
- **File:** `frontend/src/components/RuntimeOverviewPanel.jsx`
- **Purpose:** Runtime health overview
- **Status:** Exists but may not be rendered

### 2. UltimateDashboard
- **File:** `frontend/src/components/ultimate/UltimateDashboard.jsx`
- **Line 3:** `export default function UltimateDashboard()`
- **Purpose:** Ultimate system dashboard

### 3. ArrangerDashboard
- **File:** `frontend/src/components/arranger/ArrangerDashboard.jsx`
- **Line 3:** `export default function ArrangerDashboard()`
- **Purpose:** Arranger engine dashboard
- **Fetches:** `/api/arranger/styles`

### 4. AIDashboard
- **File:** `frontend/src/components/ai/AIDashboard.jsx`
- **Line 3:** `export default function AIDashboard()`
- **Purpose:** AI features dashboard

### 5. MidiDashboard
- **File:** `frontend/src/components/MidiDashboard.jsx`
- **Line 3:** `export default function MidiDashboard()`
- **Purpose:** MIDI device monitoring

---

## Critical Integration Points

### Backend → Frontend Data Flow
1. **Server exposes APIs** (`backend/src/server.js` lines 47-131)
2. **Frontend fetches from APIs** (e.g., ArrangerDashboard fetches `/api/arranger/styles`)
3. **Dashboards render real-time data**

### Frontend Rendering Order (main.jsx)
```
<App>
  ├─ Explorer UI (file browser)
  ├─ MidiDashboard (MIDI monitoring)
  ├─ AIDashboard (AI features)
  ├─ ReleasePanel (production status)
  ├─ UltimateDashboard (system overview)
  ├─ EmotionalHero (cinematic header)
  ├─ MusicMoodPanel (mood selection)
  └─ ArrangerDashboard (arranger styles)
```

### API Mounting (server.js)
```javascript
app.use("/api/auth", authRoutes);
app.use("/api/arranger", arrangerRoutes);
app.use("/api/korg", korgRoutes);
app.use("/api/midi", midiRoutes);
```

---

## Data Flow: Phase 3 Integration Point

### Current State
1. **Backend:** Has STYLE parser expansion module (`styleParserExpansion.js`)
2. **Backend:** Feature flags config exists (`featureFlags.js`)
3. **Backend:** Not yet integrated into `/api/korg` routes

### Next Step: Integration
1. Import `expandStyleParser` in `backend/src/server.js`
2. Call expansion in `/api/korg-integrity` handler (around line 47)
3. Attach `styleBankCatalog` to response
4. Enable with feature flag

### Dashboard Surfacing
1. Create new component: `StyleBankViewer.jsx`
2. Fetch `/api/korg-integrity` (includes styleBankCatalog)
3. Render bank/slot conflicts
4. Show confidence scores
5. Display orphan detection results

---

## Environment & Deployment

### Development
- **Backend:** `npm start` → port 4000
- **Frontend:** `npm run dev -- --port 5190` → port 5190
- **Feature Flag:** Set env var `DEEP_STYLE_PARSER=true`

### Production
- **Frontend Build:** `npm run build` → dist/
- **Backend:** Node.js + Express
- **Vercel:** Frontend deployed
- **CI/CD:** GitHub Actions (`npm run build && npm run smoke`)

---

## Files Ready for Phase 3 Integration

✓ `backend/src/config/featureFlags.js` — Feature system
✓ `backend/parsers/korg/styleParserExpansion.js` — Expansion module
✓ `backend/parsers/korg/styleNameNormalizer.js` — Fuzzy matching
✓ `backend/parsers/korg/linkSourceMetadata.js` — Structured links
✓ `backend/parsers/korg/linkQualityAnalyzer.js` — Orphan detection
✓ `backend/parsers/korg/songBookLinkResolver.js` — Conflict resolution
✓ `backend/parsers/korg/styleBankCatalog.js` — Bank organization
✓ `backend/parsers/korg/styleSlotDiagnostics.js` — Conflict detection
✓ `backend/parsers/korg/styleSlotResolution.js` — Resolution strategies
✓ `backend/parsers/korg/songBookStyleLinker.js` — Song-to-style linking

## Next Action: Integrate STYLE Expansion into Server

**Target:** Modify `backend/src/server.js` line 47 to call `expandStyleParser()`
**Feature Flag:** Check `DEEP_STYLE_PARSER` before expansion
**Response:** Attach `styleBankCatalog` + diagnostics to `/api/korg-integrity`
**Build & Test:** `npm run build && npm run smoke`
