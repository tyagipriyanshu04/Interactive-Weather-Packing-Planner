# Weather & Packing Planner

A production-ready vanilla JS single-page app that combines live weather data with a smart packing checklist.

## Features
- Current weather (temperature, description, humidity, wind, pressure, local time)
- 3-day forecast (min / max, condition, icon)
- Data-driven packing suggestions (rain, cold, hot, humid, windy, snow…)
- Dynamic glassmorphic theme per weather condition (CSS variables)
- Unit toggle °C / °F (single fetch, client-side conversion)
- Geolocation ("Use My Location")
- LocalStorage search history (last 5, de-duplicated, clickable)
- Robust error handling: empty input, invalid city, network failure
- Loading spinner with disabled search button
- Fully responsive (desktop 2-col, mobile stacked)

## Project Structure
```
weather-packing-planner/
├── index.html
├── css/
│   ├── style.css
│   └── responsive.css
├── js/
│   ├── app.js            # Orchestrator
│   ├── api.js            # OpenWeatherMap fetchers
│   ├── ui.js             # DOM rendering only
│   ├── packingRules.js   # Data-driven rules engine
│   ├── theme.js          # CSS variable theming
│   └── utils.js          # Helpers (conversion, formatting, storage)
└── assets/icons/
```

## Setup

### 1. API Key
Open `js/api.js` and set:
```js
const API_KEY = "YOUR_OPENWEATHERMAP_KEY";
```
Get a free key at https://home.openweathermap.org/api_keys.

### 2. Run Locally
Any static server works. Two easy options:

**Python 3:**
```bash
cd weather-packing-planner
python3 -m http.server 3000
```
Open http://localhost:3000.

**Node (serve):**
```bash
npx serve -l 3000 weather-packing-planner
```

> ES Modules require an HTTP server — opening `index.html` directly via `file://` will not work.

## Adding / Editing Packing Rules
`js/packingRules.js` uses a data-driven approach. Add a rule object:
```js
{
  id: "uv-high",
  match: ({ main, tempC }) => main === "Clear" && tempC > 25,
  items: ["🕶️ UV sunglasses"],
}
```
Rules are evaluated independently — multiple rules can contribute simultaneously.

## Notes
- Weather is fetched in metric units once; conversion to Fahrenheit is client-side (no re-fetch).
- Theme colors are set as CSS variables from `theme.js`; no hardcoded per-city classes.
- History is stored under localStorage key `wpp_history`.
