// app.js — orchestrator

import {
  fetchCurrentWeather,
  fetchForecast,
  fetchCurrentWeatherByCoords,
  fetchForecastByCoords,
} from "./api.js";
import {
  showLoading,
  hideLoading,
  showError,
  hideError,
  showResults,
  showEmpty,
  renderCurrentWeather,
  renderForecast,
  renderPackingSuggestions,
  renderHistory,
  setActiveUnit,
} from "./ui.js";
import { getPackingSuggestions } from "./packingRules.js";
import { applyTheme } from "./theme.js";
import { addToHistory, getHistory } from "./utils.js";

// --- State ---
const state = {
  unit: "C", // "C" or "F"
  current: null, // last API current data
  forecast: null, // last API forecast data
};

// --- DOM refs ---
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const geoBtn = document.getElementById("geoBtn");
const unitButtons = document.querySelectorAll(".unit-btn");

// --- Handlers ---
async function loadByCity(city) {
  const clean = (city || "").trim();
  if (!clean) {
    showError("Please enter a city name.");
    return;
  }
  hideError();
  showLoading();
  try {
    const [current, forecast] = await Promise.all([
      fetchCurrentWeather(clean),
      fetchForecast(clean),
    ]);
    handleSuccess(current, forecast, clean);
  } catch (err) {
    handleError(err);
  } finally {
    hideLoading();
  }
}

async function loadByCoords(lat, lon) {
  hideError();
  showLoading();
  try {
    const [current, forecast] = await Promise.all([
      fetchCurrentWeatherByCoords(lat, lon),
      fetchForecastByCoords(lat, lon),
    ]);
    handleSuccess(current, forecast, current.name);
  } catch (err) {
    handleError(err);
  } finally {
    hideLoading();
  }
}

function handleSuccess(current, forecast, cityForHistory) {
  state.current = current;
  state.forecast = forecast;

  const main = current.weather?.[0]?.main || "Default";
  applyTheme(main, current.main.temp);

  renderCurrentWeather(current, state.unit);
  renderForecast(forecast, state.unit);

  const suggestions = getPackingSuggestions({
    main,
    tempC: current.main.temp,
    humidity: current.main.humidity,
    windMs: current.wind.speed,
  });
  renderPackingSuggestions(suggestions);

  showResults();

  if (cityForHistory) {
    const hist = addToHistory(cityForHistory);
    renderHistory(hist, onHistorySelect);
  }
}

function handleError(err) {
  if (err.code === "NOT_FOUND") {
    showError("City not found.");
  } else if (err.code === "NETWORK") {
    showError("Unable to fetch weather data.");
  } else if (err.code === "UNAUTHORIZED") {
    showError("API key invalid or not yet activated. New OpenWeatherMap keys can take up to 2 hours to activate.");
  } else {
    showError("Something went wrong. Please try again.");
  }
}

function onHistorySelect(city) {
  cityInput.value = city;
  loadByCity(city);
}

// --- Event listeners ---
searchBtn.addEventListener("click", () => loadByCity(cityInput.value));
cityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") loadByCity(cityInput.value);
});
cityInput.addEventListener("input", () => hideError());

geoBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    showError("Geolocation is not supported by your browser.");
    return;
  }
  showLoading();
  navigator.geolocation.getCurrentPosition(
    (pos) => loadByCoords(pos.coords.latitude, pos.coords.longitude),
    () => {
      hideLoading();
      showError("Unable to access your location.");
    },
    { timeout: 10000 }
  );
});

unitButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const unit = btn.dataset.unit;
    if (unit === state.unit) return;
    state.unit = unit;
    setActiveUnit(unit);
    // Re-render without another API call
    if (state.current && state.forecast) {
      renderCurrentWeather(state.current, unit);
      renderForecast(state.forecast, unit);
    }
  });
});

// --- Init ---
(function init() {
  setActiveUnit(state.unit);
  const hist = getHistory();
  renderHistory(hist, onHistorySelect);
  showEmpty();
})();
