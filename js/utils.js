// utils.js — small reusable helpers

export function convertTemperature(celsius, unit) {
  if (unit === "F") return (celsius * 9) / 5 + 32;
  return celsius;
}

export function formatTemp(celsius, unit) {
  return Math.round(convertTemperature(celsius, unit));
}

export function capitalize(str = "") {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function dayName(dateInput) {
  const d = new Date(dateInput);
  return d.toLocaleDateString(undefined, { weekday: "short" });
}

export function formatLocalTime(dtSec, tzOffsetSec) {
  // OpenWeather provides dt (UTC seconds) and timezone offset in seconds
  const localMs = (dtSec + tzOffsetSec) * 1000;
  const d = new Date(localMs);
  return d.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });
}

export function debounce(fn, delay = 200) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}

// Local storage helpers for search history
const HISTORY_KEY = "wpp_history";
const HISTORY_LIMIT = 5;

export function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
  } catch {
    return [];
  }
}

export function addToHistory(city) {
  if (!city) return getHistory();
  const clean = city.trim();
  if (!clean) return getHistory();
  const list = getHistory().filter(
    (c) => c.toLowerCase() !== clean.toLowerCase()
  );
  list.unshift(clean);
  const trimmed = list.slice(0, HISTORY_LIMIT);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
  return trimmed;
}
