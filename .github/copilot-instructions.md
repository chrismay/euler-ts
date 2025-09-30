# Copilot Instructions for AI Agents

## Project Overview
- This is a TypeScript monorepo for solving Project Euler problems, organized by problem ranges (e.g., `ex1_10/`, `ex11_20/`, `ex21_20/`).
- The entry point is `index.ts`, which imports and runs grouped problem modules.
- Utility functions are centralized in `util/` (e.g., number theory, generators, reducers, predicates).

## Key Patterns & Conventions
- Each problem group (e.g., `ex1To10`, `ex11To20`) is implemented as a function that calls individual problem functions (e.g., `ex1`, `ex2`, ...).
- Utilities are re-exported via `util/index.ts` for easy import.
- Array prototype is extended with `.last()` globally (see `util/index.ts`).
- Use functional programming patterns: generators, map/filter/reduce, and custom combinators are common.
- Prefer `ℕ()` and other generator utilities for sequence generation.
- Problem solutions log results to the console with a prefix (e.g., `Ex1:`).

## Developer Workflows
- **Build:** `npm run build` (outputs to `out/`)
- **Test:** `npm test` (runs compiled JS from `out/index.js`)
- **Lint:** `npm run prebuild` (uses ESLint with TypeScript plugin)
- **CI:** GitHub Actions run lint and Node.js CI on push (see `.github/workflows/`)
- **TypeScript:** Strict mode enabled, targeting ES2015, with decorators and BigInt support.

## Integration & Dependencies
- Uses `pipe-ts` for functional composition.
- No external test framework; tests are run as part of the main script.
- ESLint config in `.eslintrc.json` (semi required, explicit return types off except for expressions).

## Examples
- To add a new problem, create a function in the appropriate `exXX_YY/` folder and export it in that folder's `index.ts`.
- To use a utility, import from `../util` (e.g., `import { sum, primes } from "../util"`).

## Special Notes
- Some problems (e.g., Ex10) are intentionally skipped in normal runs due to performance (see comments in `ex1_10/index.ts`).
- Avoid modifying the global Array prototype unless extending `.last()`.

---

For questions or unclear conventions, review `index.ts`, `util/`, and the relevant `exXX_YY/` folder for examples.
