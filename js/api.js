// api.js — OpenWeatherMap integration

// NOTE: Replace with your own key in production.
const API_KEY = "c088560ad65c2b0113f1213136e36219";
const BASE = "https://api.openweathermap.org/data/2.5";

async function safeFetch(url) {
  let res;
  try {
    res = await fetch(url);
  } catch (err) {
    const e = new Error("network");
    e.code = "NETWORK";
    throw e;
  }
  if (res.status === 401) {
    const e = new Error("unauthorized");
    e.code = "UNAUTHORIZED";
    throw e;
  }
  if (res.status === 404) {
    const e = new Error("not-found");
    e.code = "NOT_FOUND";
    throw e;
  }
  if (!res.ok) {
    const e = new Error("api-error");
    e.code = "API_ERROR";
    e.status = res.status;
    throw e;
  }
  return res.json();
}

export async function fetchCurrentWeather(city) {
  const url = `${BASE}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
  return safeFetch(url);
}

export async function fetchForecast(city) {
  const url = `${BASE}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
  return safeFetch(url);
}

export async function fetchCurrentWeatherByCoords(lat, lon) {
  const url = `${BASE}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  return safeFetch(url);
}

export async function fetchForecastByCoords(lat, lon) {
  const url = `${BASE}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  return safeFetch(url);
}

export function iconUrl(iconCode) {
  return `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
}

export function forecastIconUrl(iconCode) {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}
