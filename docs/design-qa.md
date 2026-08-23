# Design and browser QA

## Product checks

- The public product name, wordmark, and document title are Consistency.
- Today retains calories, macros, water, sleep, training context, recent food, meal ideas, and habits.
- Log includes Diary, Food ideas, and Nutrition.
- Train includes Workout, Plans, Strength PRs, and Cardio.
- Trends includes Overview, Recovery, Muscle map, Weekly report, and Check-in.
- Settings includes profile targets, units, goal, theme, Garmin import, backup, attribution, and local reset.

## Automated browser coverage

The Playwright suite runs against desktop Chrome and a mobile Chrome viewport. It verifies:

- Every primary destination renders
- Every subview can be opened
- A meal idea can be added to the diary
- A common food can be searched and added from the local catalog
- A cardio activity can be saved
- A saved plan can launch and complete a workout
- A malformed backup cannot replace the current record
- Core screens do not overflow horizontally
- Five representative routes pass serious/critical accessibility checks in both themes with color contrast enabled

The unit suite covers nutrition totals, training calculations, recovery summaries, authentic legacy-state migration, strict backup validation, unit conversion, persistence warnings, Garmin parsing, and import deduplication.

## Responsive review sizes

- 360, 768, 1024, and 1440 pixel breakpoint checks
- 390 by 844 mobile screenshots
- 1440 by 1000 desktop screenshots

The desktop layout uses a fixed navigation rail and a wide work surface. The mobile layout moves navigation to a fixed bottom bar, stacks forms and panels, and keeps subnavigation horizontally available without expanding the page width.

## Copy rules

Visible source copy is checked for emoji, promotional filler, version labels, and long dash punctuation. Health claims are kept narrow, check-in guidance is derived from saved records, and settings clarify that user targets are personal inputs rather than medical recommendations.

## Review screenshots

- `docs/qa/screenshots/today-desktop.png`
- `docs/qa/screenshots/food-ideas-desktop.png`
- `docs/qa/screenshots/food-search-desktop.png`
- `docs/qa/screenshots/train-desktop.png`
- `docs/qa/screenshots/weekly-report-desktop.png`
- `docs/qa/screenshots/settings-desktop.png`
- Matching mobile captures are stored in the same folder.
