# HealthCore

HealthCore is a static health and fitness dashboard for logging nutrition, hydration, weight trends, workouts, strength progress, and optional AI-assisted wellness reflections.

The project is built as a single-page HTML/CSS/JavaScript app. It runs entirely in the browser, stores user data in `localStorage`, and can be hosted from GitHub Pages, Netlify, or any static file host.

## Features

- Daily calorie, macro, micronutrient, and water tracking
- USDA FoodData Central search with manual food entry fallback
- Personal food library for reusable meals and ingredients
- Workout logging for push, pull, legs, shoulders, and custom sessions
- Strength estimates, one-rep max tracking, muscle volume, and percentile views
- Weight history, trend chart, and recent-entry log
- Optional Groq-powered AI Coach using a locally stored API key
- JSON export for personal backups

## Privacy Notes

- HealthCore does not include a backend.
- Food, workout, profile, goal, and API-key data stay in the browser's local storage.
- USDA search uses the public `DEMO_KEY`, which is rate limited.
- The AI Coach only sends data to Groq after the user adds a Groq API key and runs an analysis.
- AI Coach output is for general wellness reflection only and is not medical advice.

## Run Locally

Open `index.html` in a browser, or serve the folder locally:

```bash
python3 -m http.server 4173
```

Then visit `http://127.0.0.1:4173`.

## Deployment

Because the app is static, the root `index.html` can be deployed directly with GitHub Pages or Netlify.

## Author

Jacob Coleman<br>
[github.com/JacobColeman921](https://github.com/JacobColeman921)
