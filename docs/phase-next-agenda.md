# Keyboard Manager — Next Execution Agenda

## Current Phase
Phase 3 — Deep Korg Parser / Arranger Intelligence Foundation

## Completed Foundations
- STYLE bank catalog
- STYLE slot diagnostics
- duplicate slot preservation
- STYLE slot resolution summary
- SongBook STYLE linking
- STYLE PCM linking
- PCM dependency diagnostics
- STYLE repair suggestions
- SET integrity summary
- parser dashboard summary
- analyzer dashboard exposure groundwork

## Next Tasks

### Task 1 — Korg Integrity API
Goal:
Expose `/api/korg/integrity`.

Return:
- parserDashboardSummary
- setIntegritySummary
- repairSuggestions
- unresolved PCM references
- SongBook unresolved links

Status:
In progress.

### Task 2 — Frontend Integrity Dashboard
Goal:
Add dashboard cards for:
- health score
- STYLE conflicts
- missing PCM
- SongBook unresolved
- repair suggestion count

### Task 3 — Live Scan Trigger
Goal:
Add button/action to re-run analyzer and refresh parser diagnostics.

### Task 4 — Repair Planner
Goal:
Convert repair suggestions into actionable plans:
- keep primary STYLE
- review duplicate STYLE slot
- restore missing PCM
- relink SongBook style

### Task 5 — Phase 4 Groundwork
Goal:
Prepare arranger runtime:
- style preload plan
- PCM preload map
- transport state foundation
- MIDI routing preparation
