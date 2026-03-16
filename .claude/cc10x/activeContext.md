# Active Context
<!-- CC10X: Do not rename headings. Used as Edit anchors. -->

## Current Focus
Game-state persistence, session resume, and schema-safe localStorage handling are implemented and verified.

## Recent Changes
- Unified canonical `GameState` and `LevelProgress` in `src/types/game.ts`, then migrated `src/hooks/useGameState.ts` to use that type with schema versioning and storage-event sync.
- Added `src/hooks/useSessionPersistence.ts` and wired `PracticeScreen` to resume in-progress levels, save progress/input, and clear completed sessions.
- Fixed related import/build blockers so final `npm run build` and `npm run lint` both pass.

## Next Steps
1. Keep future progression changes compatible with `version`ed game-state migrations and the 30-minute session TTL.

## Decisions
- Canonical progression types now live in `src/types/game.ts`; hook files consume and re-export them only for compatibility.
- In-progress practice sessions persist in localStorage per level (`hp-math-session-{levelId}`) and expire after 30 minutes.
- Game-state loads migrate legacy no-version payloads and fail safe to defaults on unknown or invalid schemas.

## Learnings
- Practice sessions must save immediately after each answer to survive refreshes during answer-transition animations.
- This repo is being edited concurrently; spot-checking current file contents before patching avoids stomping newer route/UI changes.

## References
- Plan: N/A
- Design: N/A
- Research: N/A

## Blockers
- None.

## Last Updated
2026-03-16 (state persistence work complete)
