# Mettlefield redesign implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild HealthCore as the portfolio-ready Mettlefield local health and training product while preserving existing browser data and feature coverage.

**Architecture:** A Vite React application replaces the single HTML monolith and still deploys as static GitHub Pages files. Feature modules consume typed domain services and a versioned Zustand store. A migration adapter reads the existing `hc_*` keys without deleting them.

**Tech Stack:** React 19, TypeScript, Vite, React Router, Zustand, Motion, Phosphor Icons, Recharts, Vitest, React Testing Library, Playwright, axe, native CSS tokens.

**Spec:** `docs/superpowers/specs/2026-08-22-mettlefield-redesign-design.md`

## Global constraints

- Preserve current `hc_*` browser data and create a tested one-time migration.
- Keep deployment static and compatible with `/HealthCore/` on GitHub Pages.
- Use no emoji or em dash characters in visible product copy.
- Use Phosphor as the only interface icon family.
- Generate no more than two raster assets.
- Keep all health guidance educational and label estimates.
- Support system-aware light and dark themes.
- Verify 375, 414, 768, 1024, and 1440 pixel layouts.

---

### Task 1: Establish the tested application shell

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.app.json`
- Create: `tsconfig.node.json`
- Create: `src/main.tsx`
- Create: `src/app/App.tsx`
- Create: `src/app/router.tsx`
- Create: `src/styles/tokens.css`
- Create: `src/styles/global.css`
- Create: `src/test/setup.ts`
- Create: `src/app/App.test.tsx`
- Modify: `.github/workflows/pages.yml`
- Modify: `.gitignore`

**Interfaces:**
- Produces: `App`, `router`, semantic theme tokens, `npm run test`, `npm run typecheck`, and `npm run build`.

- [ ] Write `App.test.tsx` to render `/today` and assert a `Today` heading and five navigation destinations.
- [ ] Run `npm test -- src/app/App.test.tsx` and verify the missing app fails.
- [ ] Add the Vite, React, TypeScript, test, font, icon, state, router, chart, and motion dependencies.
- [ ] Implement the shell with skip link, navigation landmark, route outlet, theme tokens, and a mobile-first layout.
- [ ] Configure Vite with `base: '/HealthCore/'` for production and `/` in tests.
- [ ] Change Pages deployment to install dependencies, build, and upload `dist`.
- [ ] Run the focused test, typecheck, and production build.
- [ ] Commit with `chore: establish mettlefield application shell`.

### Task 2: Protect the existing data model

**Files:**
- Create: `src/domain/types.ts`
- Create: `src/domain/defaults.ts`
- Create: `src/storage/schema.ts`
- Create: `src/storage/migrateLegacyState.ts`
- Create: `src/storage/persistence.ts`
- Create: `src/storage/migrateLegacyState.test.ts`
- Create: `src/store/useMettlefieldStore.ts`
- Create: `src/store/selectors.ts`

**Interfaces:**
- Consumes: legacy keys prefixed with `hc_`.
- Produces: `MettlefieldStateV1`, `migrateLegacyState(storage: Storage): MigrationResult`, `loadState()`, `saveState(state)`, and `useMettlefieldStore`.

- [ ] Write migration fixtures for profile, goals, entries, workouts, cardio, sleep, weight, habits, plans, manual maxes, and optional integration settings.
- [ ] Assert migration preserves source values, normalizes missing arrays, records schema version 1, and leaves legacy keys untouched.
- [ ] Run the migration test and verify it fails because the adapter is absent.
- [ ] Implement the typed schema, defaults, migration, persistence errors, and Zustand store.
- [ ] Add import validation and export serialization tests.
- [ ] Run storage and store tests, typecheck, and build.
- [ ] Commit with `feat: add versioned local data migration`.

### Task 3: Build the responsive navigation and shared controls

**Files:**
- Create: `src/components/navigation/AppNavigation.tsx`
- Create: `src/components/navigation/AppNavigation.test.tsx`
- Create: `src/components/ui/Button.tsx`
- Create: `src/components/ui/IconButton.tsx`
- Create: `src/components/ui/Field.tsx`
- Create: `src/components/ui/Dialog.tsx`
- Create: `src/components/ui/SegmentedControl.tsx`
- Create: `src/components/ui/EmptyState.tsx`
- Create: `src/components/ui/InlineNotice.tsx`
- Create: `src/components/ui/Skeleton.tsx`
- Create: `src/components/ui/Metric.tsx`
- Create: `src/styles/components.css`

**Interfaces:**
- Produces: accessible shared controls and `AppNavigation` for five routes.

- [ ] Test keyboard navigation, current-route labeling, 44px controls, dialog focus return, field labels, and error association.
- [ ] Run component tests and verify the missing components fail.
- [ ] Implement all controls using semantic elements, Phosphor icons, and documented radius tokens.
- [ ] Add desktop rail, tablet header, and mobile bottom navigation without duplicating destination labels.
- [ ] Run component tests and an axe scan of the shell.
- [ ] Commit with `feat: add responsive navigation and ui foundation`.

### Task 4: Preserve health and training calculations

**Files:**
- Create: `src/domain/nutrition.ts`
- Create: `src/domain/training.ts`
- Create: `src/domain/recovery.ts`
- Create: `src/domain/reports.ts`
- Create: `src/domain/nutrition.test.ts`
- Create: `src/domain/training.test.ts`
- Create: `src/domain/recovery.test.ts`
- Create: `src/domain/reports.test.ts`

**Interfaces:**
- Produces: `calculateNutritionTotals`, `estimateTdee`, `estimateOneRepMax`, `calculateTrainingVolume`, `calculateWorkoutStreak`, `aggregateMuscleVolume`, `calculateRecoverySummary`, and `buildWeeklyReport`.

- [ ] Create fixtures from representative records in the legacy app.
- [ ] Write tests for ordinary values, incomplete records, zero values, unit conversion, and date boundaries.
- [ ] Run domain tests and verify they fail because the functions are absent.
- [ ] Port the current formulas into pure typed functions and return unavailable states when inputs are insufficient.
- [ ] Run all domain tests and compare representative results against the legacy implementation.
- [ ] Commit with `feat: extract tested health calculations`.

### Task 5: Implement Today and Log workflows

**Files:**
- Create: `src/features/today/TodayRoute.tsx`
- Create: `src/features/today/TodayRoute.test.tsx`
- Create: `src/features/log/LogRoute.tsx`
- Create: `src/features/log/FoodDiary.tsx`
- Create: `src/features/log/FoodEntryDialog.tsx`
- Create: `src/features/log/QuickLogSheet.tsx`
- Create: `src/features/log/LogRoute.test.tsx`
- Create: `src/features/log/foodSearch.ts`
- Create: `src/features/log/foodSearch.test.ts`

**Interfaces:**
- Consumes: store actions and nutrition selectors.
- Produces: daily overview, food diary, local food search, manual entry, water, weight, and sleep logging.

- [ ] Test empty, populated, loading, invalid form, storage warning, and saved-food states.
- [ ] Run Today and Log tests and verify the routes fail before implementation.
- [ ] Implement Today with one primary daily-status surface, quick actions, next workout, and short trend summaries.
- [ ] Implement Log with meal-grouped food entries, labeled forms, local search, manual fallback, and quick logging sheets.
- [ ] Ensure action labels contain one short verb and all totals state their units.
- [ ] Run focused tests, typecheck, and build.
- [ ] Commit with `feat: rebuild daily logging workflows`.

### Task 6: Add the exercise repository and training workflow

**Files:**
- Create: `src/exercises/types.ts`
- Create: `src/exercises/normalizeExercise.ts`
- Create: `src/exercises/RepDbExerciseRepository.ts`
- Create: `src/exercises/normalizeExercise.test.ts`
- Create: `src/data/exercises.json`
- Create: `public/exercises/`
- Create: `src/features/train/TrainRoute.tsx`
- Create: `src/features/train/ExerciseLibrary.tsx`
- Create: `src/features/train/ExerciseDetailDialog.tsx`
- Create: `src/features/train/ActiveWorkout.tsx`
- Create: `src/features/train/WorkoutPlans.tsx`
- Create: `src/features/train/TrainRoute.test.tsx`
- Create: `public/credits/exercise-data.txt`

**Interfaces:**
- Produces: `ExerciseRepository.search(query, filters)`, `ExerciseRepository.getById(id)`, exercise detail views, plans, and active workout logging.

- [ ] Download the canonical free-tier data snapshot and retain only production-licensed files and required attribution.
- [ ] Test normalization for two-pose and single-pose media, missing descriptions, image errors, filters, and stable IDs.
- [ ] Run repository tests and verify the missing implementation fails.
- [ ] Implement the repository without provider URLs in feature components.
- [ ] Build the exercise library with lazy fixed-size images, filters, instructions, text fallback, and visible credit in Settings and README.
- [ ] Build plans and active workout controls with last-set context, set entry, rest timer, finish summary, and persistence.
- [ ] Run repository, route, and accessibility tests.
- [ ] Commit with `feat: add exercise library and guided workouts`.

### Task 7: Create original character and muscle-map assets

**Files:**
- Create: `public/art/sam-minuteman.png`
- Create: `public/art/training-figures-front-back.png`
- Create: `src/features/trends/MuscleMap.tsx`
- Create: `src/features/trends/MuscleMap.test.tsx`

**Interfaces:**
- Consumes: `aggregateMuscleVolume` and generated transparent PNG assets.
- Produces: front/rear muscle visualization with programmatic accessible overlays.

- [ ] Generate one transparent Sam asset in a restrained editorial character style with no logos, text, weapons, or copied mascot marks.
- [ ] Generate one transparent front/rear training-figure sheet with a neutral pose and no labels.
- [ ] Inspect both images for artifacts and preserve only the final two files.
- [ ] Test muscle highlighting, period selection, textual summary, and no-data fallback.
- [ ] Implement programmatic overlays so muscle intensity comes from data rather than pixels in the generated image.
- [ ] Run tests and inspect the map in both themes.
- [ ] Commit with `feat: add original mettlefield artwork and muscle map`.

### Task 8: Implement Trends, settings, backup, and optional review tools

**Files:**
- Create: `src/features/trends/TrendsRoute.tsx`
- Create: `src/features/trends/TrendChart.tsx`
- Create: `src/features/trends/TrendsRoute.test.tsx`
- Create: `src/features/settings/SettingsRoute.tsx`
- Create: `src/features/settings/DataControls.tsx`
- Create: `src/features/settings/SettingsRoute.test.tsx`
- Create: `src/features/review/ReviewPanel.tsx`
- Create: `src/features/review/ReviewPanel.test.tsx`

**Interfaces:**
- Consumes: domain report functions, store state, persistence import/export, and optional user keys.
- Produces: trends, textual chart summaries, settings, credits, backup and restore, and bounded optional analysis.

- [ ] Test chart empty states, text summaries, settings validation, theme persistence, invalid import, successful restore, and remote-analysis failure.
- [ ] Run route tests and verify they fail before implementation.
- [ ] Implement responsive charts with fixed aspect ratios and adjacent text summaries.
- [ ] Implement settings and data controls, including a backup before destructive reset.
- [ ] Move optional analysis into a secondary Review panel and rewrite prompts and labels as educational summaries.
- [ ] Run focused tests, typecheck, and build.
- [ ] Commit with `feat: add trends settings and data controls`.

### Task 9: Humanize copy and complete responsive accessibility QA

**Files:**
- Modify: all visible strings under `src/`
- Create: `scripts/check-copy.mjs`
- Create: `docs/design-qa.md`
- Create: `playwright.config.ts`
- Create: `tests/e2e/core-flows.spec.ts`
- Create: `tests/e2e/responsive.spec.ts`

**Interfaces:**
- Produces: copy scanner, core-flow tests, breakpoint tests, and recorded design QA.

- [ ] Implement a copy scanner that fails on emoji ranges, em dash, en dash, version labels, generic AI marketing terms, and duplicated primary CTA labels.
- [ ] Run the scanner and rewrite every flagged visible string using the humanizer draft, audit, and final loop.
- [ ] Add Playwright flows for onboarding, food logging, workout completion, exercise search, theme, export/import, and mobile navigation.
- [ ] Add viewport assertions at 375, 414, 768, 1024, and 1440 pixels with horizontal-overflow checks.
- [ ] Run axe on Today, Log, Train, Trends, and Settings in light and dark themes.
- [ ] Record contrast, keyboard, reduced-motion, touch-target, loading, empty, and error-state evidence in `docs/design-qa.md`.
- [ ] Commit with `test: complete responsive accessibility and copy qa`.

### Task 10: Publish portfolio-ready documentation and evidence

**Files:**
- Modify: `README.md`
- Create: `docs/PROJECT_STATE.md`
- Create: `docs/CASE_STUDY.md`
- Create: `docs/screenshots-v2/`
- Modify: repository metadata strings in `index.html` replacement and manifest files.

**Interfaces:**
- Produces: current setup instructions, architecture and privacy notes, before/after case study, final screenshots, and deployable production output.

- [ ] Capture Today, Log, Train, exercise detail, Trends, and mobile workout screens from the production build.
- [ ] Write the README around the user problem, local-first model, core workflows, technology, verification commands, and exercise-data credit.
- [ ] Write the case study with observed audit evidence, decisions, implementation, limitations, and test results. Do not invent user research or outcome metrics.
- [ ] Update the Pages workflow artifact and verify the built route loads at `/HealthCore/`.
- [ ] Run `npm test`, `npm run typecheck`, `npm run check:copy`, `npm run test:e2e`, and `npm run build` from a clean process.
- [ ] Review `git diff`, scan for unrelated changes, and confirm all generated screenshots show the final build.
- [ ] Commit with `docs: publish mettlefield portfolio case study`.

