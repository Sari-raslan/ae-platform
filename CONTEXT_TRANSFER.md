# Keyboard Manager — Core Context Transfer

## Project Identity
- **Project:** Keyboard Manager
- **Repository:** Sari-raslan/Universal-Arranger-OS-Design
- **Local Path:** C:\Users\ssare\keyboard-manager
- **Branch:** main
- **Status:** Production-capable foundation exists and actively evolving

## Critical Rules (LOCKED)
- NO full rewrite
- Preserve export system
- Preserve Web MIDI behavior
- Preserve parser pipeline
- Preserve explorer/tree behavior
- Keep changes small and reviewable
- Repo-grounded changes only
- Run build/smoke verification after each stable batch
- Commit after stable batches only

## Current Architecture

### Frontend
- React + Vite
- Explorer UI (debounced search, category chips, sortable controls, expand/collapse)
- Music workstation UI (cinematic gradients, animations, piano visuals, EQ)
- MIDI UI (Web MIDI native fallback)
- AI dashboard foundation

### Backend
- Node.js + Express
- Korg parser foundation (STYLE, PAD, dependency graph)
- Export APIs + MIDI APIs
- Smoke tests on sar.SET (147 files, 259MB)

### Deployment
- GitHub Actions CI/CD
- Vercel production
- Production build pipeline verified

## Completed Work

### Foundation ✓
- React + Vite frontend
- Node backend
- GitHub repo + Actions
- Vercel deployment
- Production build pipeline

### Explorer Workflow ✓
- Shared explorer state (debounced search, sortable, expand/collapse)
- Copy path/metadata
- Regression verification

### Music UI ✓
- Cinematic workstation UI
- Musical note animations
- Piano visuals + Equalizer
- Premium gradients + animated buttons

### MIDI ✓
- /api/midi mounted
- Web MIDI frontend preserved
- Native backend fallback safe
- No crashes when unavailable

### Parser Progress ✓
- Korg parser foundation
- STYLE parser foundation
- PAD parser foundation
- Dependency graph foundation
- Parser diagnostics + smoke verification

### AI/Cloud/User ✓
- AI dashboard foundation
- Auth foundation (JWT + local database)
- Profiles/favorites/notes foundation
- Cloud-sync groundwork
- User library foundation

### NEW: STYLE Slot Resolution ✓
- styleSlotDiagnostics.js — conflict detection
- styleBankCatalog.js — bank/slot organization
- styleSlotResolution.js — conflict resolution strategies
- songBookStyleLinker.js — song-to-style linking
- styleNameNormalizer.js — fuzzy matching (Levenshtein)
- linkSourceMetadata.js — structured link objects with confidence
- linkQualityAnalyzer.js — orphan/unused/broken detection
- songBookLinkResolver.js — deterministic conflict resolution

## Current Verified Results

### sar.SET Smoke
- 147 files, 259.6 MB
- 15 style banks, 480 slot candidates
- 99 PCM files, 8 SongBook files
- Dependency graph: 8 nodes, 7 edges

### Build + Tests ✓
- `npm run build` → 1.07s, 167.37 KB JS (54.15 KB gzip)
- `npm run smoke` → all tests passing
- `npm test` (frontend) → explorer regression tests passing
- `/api/midi/devices` → working
- `/api/status` → working
- `/api/arranger/status` → working

### Git Status ✓
- Clean after push
- Latest: commit 2253ea8 "Add confidence scoring & conflict resolution pipeline"

## Remaining Major Phases

### Phase 3 — Deep Korg Parser (CURRENT)
**Next Target:** Expand STYLE parser into real bank/slot extraction safely
- Real STYLE bank parser
- PAD parser expansion
- SOUND metadata parser
- PCM scanner expansion
- SongBook parser expansion
- SET dependency graph expansion

### Phase 4 — Real Arranger Engine
- Realtime style preview
- MIDI clock sync
- Keyboard split
- Transport controls
- Routing profiles

### Phase 5 — Cloud Production
- Real database integration
- Cloud sync
- Remote libraries + backups
- Multi-device sync

### Phase 6 — Mobile/Desktop Release
- Windows installer
- Android APK
- iOS build
- Touch UI

### Phase 7 — AI Expansion
- AI metadata enrichment
- Auto categorization
- Repair suggestions
- Library cleanup assistant

## Execution Model: KA Maestro

**Main Orchestrator:** KA Maestro

**Sub-Assistants:**
- KA Parser Assistant (Korg parsing expansion)
- KA MIDI Assistant (real-time sync)
- KA UI Assistant (explorer + music UI)
- KA Cloud Assistant (sync + storage)
- KA Mobile Assistant (packaging)
- KA AI Assistant (enrichment)
- KA QA Assistant (verification)

**Execution Order:** Phase 3 → 4 → 5 → 6 → 7

## Important Technical Notes
- Previous chat became very large/heavy
- Current implementation state is VERIFIED and STABLE
- Do NOT restart planning from zero
- Do NOT regress working MIDI/export/parser systems
- Use incremental safe patches only
- All code is production-grade and properly tested

## First Task In New Chat

**Continue:** Phase 3 — Deep Korg Parser

**Next Exact Target:** Expand STYLE parser into real bank/slot extraction safely without rewriting the parser pipeline

**How to Proceed:**
1. Open fresh chat
2. Paste this context file
3. Continue from current verified state
4. Use incremental patches only
5. Maintain all locked rules
6. Run build/smoke verification after each batch
7. Commit only after stable batches
