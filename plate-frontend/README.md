# Plate — Frontend

React + Vite dashboard for the Plate meal-tracking API. Plain CSS, no framework.

## Setup

```bash
npm install
cp .env.example .env      # set VITE_API_BASE_URL if your backend isn't on 127.0.0.1:8000
npm run dev               # http://localhost:3000
```

Make sure the Django backend is running and CORS allows `http://localhost:3000`
(add it to `ALLOWED_ORIGINS` in the backend `.env`).

## Structure

```
src/
  api.js                 # all fetch calls + error handling (400/404/409/network)
  utils.js               # date/time helpers (local <-> ISO UTC)
  styles.css             # design system (nutrition-facts-label signature element)
  App.jsx                # top-level state: filters, meals, summary, trends
  components/
    MealForm.jsx         # add-meal form, client + server-side validation
    Filters.jsx           # date / tag / search filters (combinable)
    MealList.jsx          # paginated list, delete, loading/error/empty states
    SummaryBar.jsx        # calories vs goal + macros, styled as a nutrition label
    TrendsChart.jsx        # hand-rolled SVG bar chart, click-to-filter
```

## How live updates work

`App.jsx` owns `meals`, `summary`, and `trends` state. Adding or deleting a meal
calls `loadMeals()`, `loadSummary()`, and `loadTrends()` again — no page reload,
no prop drilling through a mock. Every fetch happens against the real backend
URL in `VITE_API_BASE_URL`.

## Build

```bash
npm run build      # outputs to dist/
npm run preview    # serve the production build locally
```

Deploy `dist/` to Vercel/Netlify, and set `VITE_API_BASE_URL` to your deployed
backend URL as an environment variable in the hosting dashboard.
