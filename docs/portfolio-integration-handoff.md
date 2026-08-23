# Portfolio integration handoff

This document records the portfolio changes that should follow visual approval of Consistency. It is deliberately kept in the application repository so the portfolio can remain unchanged during review.

## Current portfolio mismatch

The portfolio still presents the project as HealthCore and describes the former HTML, CSS, JavaScript, and Chart.js implementation. Its screenshot capture script also calls the retired `window.showView` API and seeds only the old `hc_*` browser-storage keys.

## Approved-name changes

- Display name: Consistency
- Existing repository and public URL: retain the current HealthCore slug unless the repository itself is renamed later
- Case-study route: retain `/work/healthcore/` to avoid breaking existing links
- Suggested eyebrow: A personal training and nutrition record.

### Historical Mettlefield working-name screen

The following preliminary screen was completed for the Mettlefield working name on August 22, 2026:

- exact-name web searches did not identify a current fitness application or software product using Mettlefield
- GitHub's repository search returned no repository named Mettlefield
- the npm registry returned no Mettlefield package
- Apple's public software search returned no Mettlefield application
- exact-name searches of Google Play and public company results returned no relevant product

This is a practical collision screen, not a legal trademark opinion or formal clearance search. Before commercial release, search the USPTO database directly and obtain legal advice if the name will become a registered brand.

## Evidence-backed project description

Consistency is a personal training and nutrition record for planning workouts, logging food and hydration, reviewing recovery, and following changes over time. It keeps personal entries in the browser, works without an account, and supports portable backup and restore.

The case study may accurately describe:

- a five-destination responsive application: Today, Log, Train, Trends, and Settings
- food diary, retained meal ideas, nutrition review, and a 719-item common-food catalog
- workout execution, editable plans, training history, strength records, cardio, and a 400-exercise RepDB library
- weight, recovery, muscle-load, weekly-report, and check-in views
- Garmin CSV and JSON import with deduplication and unit normalization
- strict versioned local-state validation, legacy HealthCore migration, recovery-copy handling, and backup/restore
- keyboard, screen-reader, contrast, responsive, and reduced-motion considerations

Do not claim cloud synchronization, medical outcomes, a large user base, or clinical validation.

## Technology correction

Replace the former stack with:

- React 19
- TypeScript
- Vite
- React Router
- Zustand
- Zod
- Recharts
- Motion
- Vitest and Playwright
- browser storage

## Screenshot set

Capture the real application at a 1440 by 1000 CSS viewport with device scale factor 2, producing 2880 by 2000 PNG files:

1. Today: `#/today`
2. Food ideas: `#/log?view=ideas`
3. Workout: `#/train?view=workout`
4. Weekly report: `#/trends?view=report`

The recommended three-image portfolio sequence is Today, Workout, and Weekly report. Food ideas should replace Workout only if nutrition is the intended emphasis.

Capture from a deterministic `mettlefield_state_v1` fixture or allow the built-in HealthCore migration to run before the first screenshot. Do not call `window.showView`; navigation is route based.

## Copy constraints

- Use the product name Consistency consistently in visible copy, alt text, metadata, tests, and resume content.
- Keep the repository URL accurate even if its slug remains HealthCore.
- Describe local storage plainly; do not call it a private database.
- Avoid claims such as intelligent, personalized, optimized, comprehensive, or AI-powered.
- Credit RepDB in the case study or repository documentation when exercise imagery is discussed.

## Release order

1. Receive visual approval for the local Consistency preview.
2. Merge the reviewed application branch.
3. Publish and verify the GitHub Pages application.
4. Recapture portfolio screenshots from the published build.
5. Update portfolio project data, resume copy, metadata, sitemap date, tests, and screenshot assets.
6. Run portfolio unit, build, browser, responsive, and link checks.
7. Publish the portfolio and verify both public URLs.
