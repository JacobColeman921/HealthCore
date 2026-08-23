# Consistency Portfolio Release Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish the reviewed HealthCore redesign under the portfolio project name Consistency, capture current product evidence, and replace the portfolio's outdated HealthCore case study.

**Architecture:** Keep the repository slug, GitHub Pages base path, portfolio route, TypeScript state types, and `mettlefield_state_v1` storage key stable. Change user-facing branding and public documentation to Consistency, publish the application, capture deterministic 2x screenshots from the real routed interface, then update the portfolio content and assets around those verified screenshots.

**Tech Stack:** React 19, TypeScript, Vite, React Router, Zustand, Zod, Recharts, Motion, Vitest, Playwright, Next.js 16

**Spec:** `docs/portfolio-integration-handoff.md`

## Global Constraints

- Visible product name: `Consistency`.
- Public descriptor: `A personal training and nutrition record.`
- Keep `https://github.com/JacobColeman921/HealthCore`, `/HealthCore/`, and `/work/healthcore/` unchanged.
- Keep `mettlefield_state_v1`, `MettlefieldStateV1`, and `useMettlefieldStore` unchanged to preserve stored records and avoid an unnecessary internal migration.
- Preserve all 52 meal ideas, the 719-item common-food catalog, and the 400-exercise RepDB library.
- Do not use generated imagery, emojis, AI claims, medical claims, outcome claims, user-count claims, or commercial-startup framing.
- Public copy must use plain sentences and pass the existing copy checker.
- Portfolio screenshots must be real application captures at 2880 by 2000 pixels and must visibly cover the daily record, meal ideas, exercise imagery, and weekly review.
- Do not overwrite unrelated changes in either repository.

---

### Task 1: Rename the public application and repository presentation

**Files:**
- Modify: `tests/e2e/core-flows.spec.ts`
- Modify: `src/components/navigation/AppNavigation.tsx`
- Modify: `src/features/settings/SettingsRoute.tsx`
- Modify: `index.html`
- Modify: `package.json`
- Modify: `README.md`
- Modify: `docs/feature-parity.md`
- Modify: `docs/brain-wiki-source-ledger.md`
- Modify: `docs/design-qa.md`
- Modify: `docs/portfolio-integration-handoff.md`
- Modify: `docs/superpowers/specs/2026-08-22-mettlefield-redesign-design.md`

**Interfaces:**
- Consumes: existing routed application and `mettlefield_state_v1` persistence contract.
- Produces: a publicly branded Consistency build whose internal persistence identifiers remain compatible.

- [ ] **Step 1: Add the failing public-brand browser assertion**

Add this assertion to the beginning of `every primary destination and subview renders`:

```ts
await expect(page.getByRole("link", { name: "Consistency home" })).toBeVisible();
await expect(page).toHaveTitle("Consistency");
```

- [ ] **Step 2: Run the focused test and verify the old brand fails**

Run: `npx playwright test tests/e2e/core-flows.spec.ts --grep "every primary" --project=desktop`

Expected: FAIL because the accessible home name and page title still say Mettlefield.

- [ ] **Step 3: Replace user-facing branding**

Set the wordmark, accessible home label, document title, meta description, package display name, backup filenames, validation message, reset instructions, and product footer to Consistency. The reset phrase becomes `CLEAR CONSISTENCY`. Do not rename internal TypeScript identifiers or the storage key.

- [ ] **Step 4: Rewrite public repository documentation**

Lead the README with Consistency and the descriptor `A personal training and nutrition record.` Keep the live URL, verification commands, privacy limits, RepDB credit, source ledger, feature history, and real product screenshots. Explain that Consistency is the portfolio-facing successor to the original HealthCore interface.

- [ ] **Step 5: Update historical design documents without falsifying history**

Where a document describes the current product, use Consistency. Where a filename, branch, storage key, internal type, or historical Mettlefield working-name decision is being recorded, preserve it and explain that Mettlefield was the working name before the final portfolio name.

- [ ] **Step 6: Verify the brand and compatibility**

Run:

```bash
npx playwright test tests/e2e/core-flows.spec.ts --grep "every primary" --project=desktop
npm run typecheck
npm test
npm run check:copy
npm run build
```

Expected: all commands exit 0; `rg -n "Mettlefield" index.html README.md src` finds only internal identifiers and compatibility messages that cannot be renamed.

- [ ] **Step 7: Commit**

```bash
git add index.html package.json README.md src tests docs
git commit -m "feat: rename public product to Consistency"
```

### Task 2: Add transparent goal and nutrition target guidance

**Files:**
- Modify: `src/domain/nutrition.ts`
- Modify: `src/domain/nutrition.test.ts`
- Modify: `src/domain/types.ts`
- Modify: `src/storage/schema.ts`
- Modify: `src/storage/migrateLegacyState.ts`
- Modify: `src/features/settings/SettingsRoute.tsx`
- Modify: `src/styles/global.css`
- Modify: `tests/e2e/core-flows.spec.ts`

**Interfaces:**
- Consumes: the current profile, latest bodyweight record, unit preference, goal, and manually entered targets.
- Produces: a transparent calorie and protein range with an explicit suggested starting target that never overwrites saved targets until the user applies it.

- [ ] **Step 1: Add failing calculator tests**

Cover Mifflin–St Jeor maintenance estimates, each goal range, the suggested midpoint, the 0.8–1.2 g/lb protein range, unit conversion, and incomplete-input behavior.

- [ ] **Step 2: Implement the pure recommendation domain function**

Return maintenance calories, a goal-specific calorie range, a suggested calorie target, the protein range, and the 1.0 g/lb suggested protein target. Use goal factors of 80–90% for Cut, 105–115% for Build, 95–105% for Maintain, and 95–100% for Recomposition. Keep the existing goal enum values for compatibility.

- [ ] **Step 3: Extend profile compatibility**

Persist age, height in centimeters, sex used by the calorie equation, and activity multiplier. Keep all new fields optional so existing backups and browser records remain valid.

- [ ] **Step 4: Build the Settings target machine**

Use clear goal labels: Cut, Build, Maintain, and Recomposition. Let the user enter bodyweight, height, age, sex for the estimate, and activity level. Use the latest weight record as the starting weight. Show maintenance, calorie range, suggested starting calories, protein range, and suggested protein. Explain the assumptions in plain language.

- [ ] **Step 5: Require explicit application**

The `Apply suggested targets` control updates the editable Calories and Protein fields, but does not persist until `Save profile and targets` is used. Changing an input or goal must not silently replace manual targets.

- [ ] **Step 6: Add browser coverage and verify**

Verify incomplete-input guidance, a complete recommendation, explicit application, manual-value preservation, save/reload persistence, responsive layout, and keyboard-accessible controls. Run unit tests, typecheck, copy check, focused Playwright, and production build.

- [ ] **Step 7: Pause for user review**

Keep the local preview running on Settings and ask the user to inspect the target machine before capturing screenshots or publishing.

### Task 3: Integrate and publish the application

**Files:**
- Modify: application Git history only

**Interfaces:**
- Consumes: verified `feat/mettlefield-redesign` branch.
- Produces: verified `main` and the live GitHub Pages build at `/HealthCore/`.

- [ ] **Step 1: Run the complete branch verification**

Run `npm run typecheck`, `npm test`, `npm run check:copy`, `npm run test:e2e`, and `npm run build` from the feature worktree. All must exit 0.

- [ ] **Step 2: Merge into local main without deleting the reviewed worktree**

Fetch origin, confirm `main` has no user changes, fast-forward or merge `feat/mettlefield-redesign` into `main`, and rerun `npm run typecheck`, `npm test`, `npm run check:copy`, and `npm run build` on the merged tree.

- [ ] **Step 3: Push main and monitor GitHub Pages**

Push `main` to `origin`, inspect the resulting GitHub Actions run, and wait for the Pages deployment to complete. Do not force-push.

- [ ] **Step 4: Verify the public application**

Confirm the live URL returns 200, the page title is Consistency, the wordmark is visible, the main routes load, meal cards render, and RepDB exercise images load from the published origin.

### Task 4: Capture portfolio-ready application evidence

**Files:**
- Modify: `tests/e2e/screenshots.spec.ts`
- Modify: `docs/qa/screenshots/today-desktop.png`
- Modify: `docs/qa/screenshots/food-ideas-desktop.png`
- Modify: `docs/qa/screenshots/train-desktop.png`
- Modify: `docs/qa/screenshots/weekly-report-desktop.png`
- Create: `docs/qa/screenshots/portfolio-today.png`
- Create: `docs/qa/screenshots/portfolio-meals.png`
- Create: `docs/qa/screenshots/portfolio-workout.png`
- Create: `docs/qa/screenshots/portfolio-weekly-report.png`

**Interfaces:**
- Consumes: published Consistency routes and deterministic `mettlefield_state_v1` fixture.
- Produces: four 2880 by 2000 lossless PNG screenshots with populated, readable content.

- [ ] **Step 1: Extend the deterministic fixture for stronger product evidence**

Keep the current nutrition and recovery history. Add a populated training plan and enough completed sets to make the training and weekly-report views credible. Do not invent users or outcomes.

- [ ] **Step 2: Capture the four portfolio frames**

Use a 1440 by 1000 CSS viewport with device scale factor 2. Capture `#/today`, `#/log?view=ideas`, `#/train?view=workout`, and `#/trends?view=report`. The workout frame must show RepDB illustrations; the meal frame must show meal photographs already included in the product or the product's existing meal presentation. Do not generate imagery.

- [ ] **Step 3: Verify image dimensions and content**

Run `sips -g pixelWidth -g pixelHeight` on every portfolio PNG and confirm 2880 by 2000. Inspect each image visually for clipping, empty states, overlays, broken assets, or unreadable text.

- [ ] **Step 4: Commit**

```bash
git add tests/e2e/screenshots.spec.ts docs/qa/screenshots
git commit -m "docs: capture Consistency portfolio views"
```

### Task 5: Replace the portfolio's HealthCore presentation

**Files:**
- Modify: `/Users/jacobcoleman/Desktop/Career/Portfolio/content/projects.ts`
- Modify: `/Users/jacobcoleman/Desktop/Career/Portfolio/content/resume.ts`
- Modify: `/Users/jacobcoleman/Desktop/Career/Portfolio/tests/project-data.test.ts`
- Modify: `/Users/jacobcoleman/Desktop/Career/Portfolio/tests/resume.test.ts`
- Modify: `/Users/jacobcoleman/Desktop/Career/Portfolio/e2e/site.spec.ts`
- Modify: `/Users/jacobcoleman/Desktop/Career/Portfolio/scripts/capture-assets.mjs`
- Replace: `/Users/jacobcoleman/Desktop/Career/Portfolio/public/images/projects/healthcore/dashboard.png`
- Replace: `/Users/jacobcoleman/Desktop/Career/Portfolio/public/images/projects/healthcore/meal-ideas.png`
- Replace: `/Users/jacobcoleman/Desktop/Career/Portfolio/public/images/projects/healthcore/weekly-report.png`
- Create: `/Users/jacobcoleman/Desktop/Career/Portfolio/public/images/projects/healthcore/workout.png`

**Interfaces:**
- Consumes: four verified 2880 by 2000 Consistency screenshots and the published GitHub repository.
- Produces: a truthful Consistency portfolio case study at the stable `/work/healthcore/` route.

- [ ] **Step 1: Change portfolio tests to require the approved presentation**

Require title `Consistency`, four screenshots ordered Today, Meals, Workout, Weekly report, and the technology list `React`, `TypeScript`, `Vite`, `Zustand`, `Zod`, `Recharts`, `Playwright`, `Browser storage`. Update browser assertions, accessible labels, gallery captions, and resume expectations accordingly.

- [ ] **Step 2: Run the focused tests and verify they fail against HealthCore**

Run `npm test -- tests/project-data.test.ts tests/resume.test.ts`.

Expected: FAIL on the old title, stack, screenshot list, and resume copy.

- [ ] **Step 3: Replace project and resume copy**

Use Consistency and `A personal training and nutrition record.` Present the problem as fragmented personal records and repeated logging friction. Describe the five-destination information architecture, retained meal and food data, RepDB exercise library, routed training flows, Garmin import, versioned local persistence, legacy migration, and tested backup recovery. State limits plainly: browser-only sync, personal-project scope, no large user study, and no health-outcome claim.

- [ ] **Step 4: Replace screenshot assets and capture script**

Copy the four verified PNG files into the existing `healthcore` asset directory. Rewrite the HealthCore branch of `capture-assets.mjs` to use routed navigation and the versioned storage fixture rather than `window.showView` and legacy storage keys.

- [ ] **Step 5: Run portfolio verification**

Run:

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
```

Expected: all commands exit 0.

- [ ] **Step 6: Inspect the rendered portfolio**

Review the home feature and `/work/healthcore/` at 375, 768, 1024, and 1440 CSS pixels. Confirm the four screenshots are legible, the gallery and lightbox labels say Consistency, the live and repository links work, and no HealthCore presentation copy remains outside stable route or asset identifiers.

- [ ] **Step 7: Commit and publish**

Commit with `feat: publish Consistency case study`, push the current portfolio branch, and verify its configured Vercel deployment. Do not overwrite unrelated branch history or force-push.
