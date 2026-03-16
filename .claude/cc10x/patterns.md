# Project Patterns
<!-- CC10X MEMORY CONTRACT: Do not rename headings. Used as Edit anchors. -->

## User Standards
- Do not touch App.tsx navigation logic for this task.

## Architecture Patterns
- Game logic is split between pure helpers in `src/game/*`, canonical shared types in `src/types/game.ts`, and persisted progression/session hooks in `src/hooks/*`.

## Code Conventions
- Use Hebrew `nameHe` fields for user-facing level and spell labels.
- Keep progression types canonical in `src/types/game.ts`; hooks should import those types instead of redefining them.

## File Structure
- React app code lives under src/.
- QA automation lives under `src/test/` with focused suites by concern.

## Testing Patterns
- Validate changes with `npm run test`, `npm run build`, and `npm run lint`.
- RTL tests can combine rendered assertions with source-level CSS checks when directionality is class-driven.

## Common Gotchas
- Another agent is handling hash routing; avoid changing screen management in App.tsx.
- Install `@testing-library/dom` alongside `@testing-library/react` in this project.
- `.test.ts` files cannot contain JSX unless renamed to `.tsx`.
- LocalStorage game-state changes must preserve backward compatibility via migration from no-version payloads and should reset safely on invalid data.

## API Patterns
- None yet.

## Error Handling
- Persistence should fail safe by resetting to defaults instead of crashing.

## Dependencies
- Vite + React + TypeScript app.
- Vitest + Testing Library provide the repo test harness for React/RTL verification.
