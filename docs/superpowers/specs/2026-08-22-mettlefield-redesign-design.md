# Mettlefield product redesign

## Status

Approved for autonomous implementation on 2026-08-22. The user asked for the plan to be created and then executed without another review pause.

## Product decision

HealthCore becomes Mettlefield, a private daily log for food, training, recovery, and progress. The name is a working product mark chosen after a preliminary web and app-store collision screen. That screen did not find another health or fitness product using the exact name. It is not a legal trademark opinion.

Mettlefield keeps the useful breadth of HealthCore but changes how the product is organized. The current application exposes nearly every feature as a separate sidebar destination. The redesign organizes the same work around five user goals:

1. Today: understand the day and act quickly.
2. Log: record food, water, weight, and sleep.
3. Train: plan and complete workouts.
4. Trends: review progress without reading a wall of cards.
5. Settings: manage targets, privacy, integrations, and backups.

Sam the Minuteman remains a supporting character. He appears in onboarding, useful empty states, and optional coaching surfaces. He is not the logo and does not decorate every screen.

## Design read

Reading this as a full consumer-product redesign for everyday health and fitness users, with a calm field-guide language, leaning toward custom React components, native CSS tokens, and restrained motion.

- `DESIGN_VARIANCE: 6`
- `MOTION_INTENSITY: 4`
- `VISUAL_DENSITY: 6`

The interface should feel practical and composed. It should not look like a gaming HUD, an AI assistant, or a generic component-library demo.

## Approaches considered

### Preserve the single HTML file

This is the smallest deployment change, but it preserves the 8,000-line monolith, inline event handlers, embedded images, weak test boundaries, and repeated view markup. A visual refresh alone would not make the product maintainable.

### Static React/Vite rebuild

This is the selected approach. It keeps GitHub Pages, local browser storage, optional user-supplied API keys, and the existing no-account model. React provides stable component and state boundaries. TypeScript and tests protect data migration and health calculations. Vite keeps the deployed output static.

### Full hosted product

Accounts, a database, sync, and passkeys would move the product closer to openGym, but they add privacy, security, and operational work that the portfolio version does not need. The data layer will leave room for future sync without introducing it now.

## Product principles

### Local by default

The browser remains the source of truth. Users can export and import a portable JSON backup. No account is required. Optional remote requests are explicit and limited to food search or user-configured analysis.

### Daily use before dashboard breadth

The first screen answers four questions: what have I logged, what needs attention, what is next, and how am I trending? Secondary analysis moves behind focused routes and disclosures.

### Honest health language

The product reports estimates as estimates. It does not diagnose, prescribe treatment, or present generated text as medical advice. Strength percentiles and recovery summaries state their basis and limitations.

### A complete interaction cycle

Every route includes useful loading, empty, success, and error states. Keyboard focus, screen-reader names, form labels, validation, and touch targets are part of the component contract.

### Human copy

Visible copy uses plain sentences. The product contains no emoji, em dash characters, invented precision, forced metaphors, or generic AI coaching language. Buttons use short verbs. The assistant is a secondary review tool, not the product identity.

## Visual system

### Theme

Mettlefield supports light and dark themes from the same semantic tokens and respects the system preference by default.

The light theme uses cold off-white surfaces and charcoal text. The dark theme uses graphite rather than pure black. A deep teal is the only interaction accent. Nutrition categories and status messages may use muted semantic colors when meaning requires them.

### Typography

Archivo Variable is the interface family. IBM Plex Mono is reserved for measurements, timestamps, and compact numeric metadata. Both fonts are bundled with the application.

Headings use weight and spacing for hierarchy rather than oversized type. Body copy remains at least 1rem. Supporting text remains at least 0.875rem.

### Shape and elevation

The radius rule is documented and mechanical:

- Primary containers: 1rem.
- Inputs and secondary controls: 0.75rem.
- Buttons: 0.75rem.
- Tags and compact filters: full pill only when the shape communicates selection.

Most grouping uses space, tint, and a single border. Shadows are limited to overlays, the mobile navigation bar, and elements that physically cover other content.

### Motion

Motion communicates route changes, item insertion, dialog state, and progress. It does not run continuously. All animation uses transform and opacity and becomes instant when the user prefers reduced motion.

### Icons

Phosphor is the only icon family. Decorative emoji and hand-drawn interface icons are removed.

## Information architecture

### Today

- Date and compact greeting.
- Daily energy and macro status.
- Quick-log actions.
- Next planned workout or a rest-day state.
- Recovery check-in using sleep and user-entered readiness.
- Recent trend summary with links to detail.

### Log

- Food diary grouped by meal.
- Food search, manual entry, saved foods, barcode/photo affordances when configured.
- Water, weight, and sleep entry sheets.
- Clear daily totals and target context.

### Train

- Today’s planned session.
- Active workout flow with large set controls, last-performance context, rest timer, and finish summary.
- Exercise library with licensed images, equipment filters, muscle filters, instructions, and form cues.
- Plans and custom routine editing.
- Strength records, estimated one-rep max, and plate calculator.

### Trends

- Weekly summary.
- Bodyweight trend.
- Nutrition consistency.
- Training volume and personal records.
- Sleep and recovery context.
- Front and rear muscle map with selectable time window.

### Settings

- Profile and units.
- Nutrition and hydration targets.
- Theme and accessibility preferences.
- Optional integration keys with clear storage notice.
- Data export, import, and reset controls.
- Credits and exercise-data attribution.

## Responsive behavior

The mobile layout is the base layout.

- Below 48rem: five-item bottom navigation, single-column content, full-width sheets, and 44px minimum targets.
- From 48rem: selected two-column layouts and persistent contextual panels where useful.
- From 64rem: compact left navigation and a content canvas capped at 90rem.
- At 90rem and above: data density increases through wider grids, not smaller text.

The interface is verified at 375, 414, 768, 1024, and 1440 CSS pixels. No route may create horizontal scrolling at 375px.

## Application architecture

### Runtime

- React 19 and TypeScript.
- Vite static build with the GitHub Pages base path.
- React Router for route-level navigation.
- Zustand for application state with a versioned persistence adapter.
- Motion for small state and route transitions.
- Phosphor for icons.
- Recharts for accessible responsive charts.

### Feature boundaries

Each feature owns its components, calculation helpers, state selectors, tests, and route. Shared UI components contain no health-domain decisions. Shared domain types live under `src/domain`.

### Storage

The persistence adapter reads existing `hc_*` keys on first launch, converts them into a versioned `mettlefield_state_v1` document, and records a migration receipt. Existing keys remain untouched until the user exports a backup and explicitly chooses cleanup.

Writes use schema validation and a single storage service. Import validates before replacing state. Reset requires a typed confirmation and creates a downloadable backup first.

### Exercise data

The exercise library consumes a normalized `Exercise` interface through `ExerciseRepository`. The initial repository is a checked-in, attributed free-tier data snapshot with WebP start and peak images. UI code never builds provider URLs directly.

Each record includes a stable ID, display name, equipment, body part, primary and secondary muscles, instructions, tips, image references, and attribution. Images are lazy loaded with fixed dimensions. A local fallback illustration and clear text instructions keep the route usable when media fails.

### Generated artwork

At most two generated raster assets are required:

1. Sam the Minuteman, a friendly full-body character on a transparent background.
2. A front-and-back neutral training figure sheet on a transparent background.

The muscle figure is decorative. Programmatic overlays remain responsible for highlighting muscle regions, so the data presentation does not depend on generative anatomical accuracy.

## Data calculations

Existing calculations are preserved behind typed pure functions before UI changes:

- Mifflin-style energy estimate currently used by HealthCore.
- Daily nutrient totals.
- Estimated one-rep max.
- Strength-level lookup.
- Workout streak.
- Muscle-volume aggregation.
- Weekly summaries.

Tests capture current behavior, then document any intentional correction. Values derived from incomplete data return an explicit unavailable state rather than a fabricated zero.

## Error handling

- Storage failure: keep the current session usable and show a persistent local-save warning.
- Invalid import: report the first useful validation errors without changing current data.
- Exercise image failure: use the local fallback and keep instructions visible.
- Network food search failure: retain local search and manual entry.
- Optional analysis failure: preserve the prompt inputs and offer retry without claiming the rest of the app is offline.
- Chart failure or empty series: show the relevant empty state and summary values.

## Accessibility

- WCAG 2.2 AA contrast for text and controls.
- Visible keyboard focus using the interaction accent.
- Semantic landmarks and one page heading per route.
- Dialog focus trapping and return focus.
- Labels above inputs with inline validation.
- Charts include text summaries and table alternatives where the values matter.
- Color never carries meaning alone.
- Reduced motion and system theme preferences are honored.

## Testing and verification

- Vitest covers calculations, migrations, reducers, repository normalization, and validation.
- React Testing Library covers navigation, forms, empty states, errors, and active workout interactions.
- Playwright covers onboarding, food logging, workout completion, exercise browsing, data export/import, theme, and mobile navigation.
- axe checks representative routes.
- Production build and GitHub Pages base-path behavior are verified.
- Visual captures are produced at 375, 768, and 1440 pixels in light and dark themes.
- Visible strings are scanned for emoji and em dash characters before release.

## Portfolio outcome

The repository and portfolio will present Mettlefield as a product case study, not a feature list. The story covers the original problem, the monolith audit, information-architecture decisions, local-data migration, exercise-media integration, accessibility, responsive testing, and before/after evidence. Claims about users or outcomes remain absent until real research supplies them.

