// ui.js — DOM rendering only

import { formatTemp, capitalize, dayName, formatLocalTime } from "./utils.js";
import { iconUrl, forecastIconUrl } from "./api.js";

const $ = (id) => document.getElementById(id);

// --- Loading / errors / empty state ---
export function showLoading() {
  $("loader").hidden = false;
  $("results").hidden = true;
  $("emptyState").hidden = true;
  $("searchBtn").disabled = true;
  $("geoBtn").disabled = true;
  $("searchBtn").querySelector(".btn-label").textContent = "Loading...";
  hideError();
}

export function hideLoading() {
  $("loader").hidden = true;
  $("searchBtn").disabled = false;
  $("geoBtn").disabled = false;
  $("searchBtn").querySelector(".btn-label").textContent = "Search";
}

export function showError(msg) {
  const el = $("errorMsg");
  el.textContent = msg;
  el.style.opacity = 0;
  requestAnimationFrame(() => {
    el.style.transition = "opacity 200ms ease";
    el.style.opacity = 1;
  });
}

export function hideError() {
  $("errorMsg").textContent = "";
}

export function showEmpty() {
  $("emptyState").hidden = false;
  $("results").hidden = true;
}

export function showResults() {
  $("emptyState").hidden = true;
  $("results").hidden = false;
}

// --- Current weather ---
export function renderCurrentWeather(data, unit) {
  const w = data.weather?.[0] || {};
  $("cityName").textContent = `${data.name}${data.sys?.country ? ", " + data.sys.country : ""}`;
  $("weatherDesc").textContent = capitalize(w.description || "");
  $("tempMain").textContent = formatTemp(data.main.temp, unit);
  $("tempUnit").textContent = `°${unit}`;
  $("feelsLike").textContent = `Feels like ${formatTemp(data.main.feels_like, unit)}°${unit}`;
  $("humidity").textContent = `${data.main.humidity}%`;
  $("wind").textContent = `${Math.round(data.wind.speed)} m/s`;
  $("pressure").textContent = `${data.main.pressure} hPa`;

  const icon = $("weatherIcon");
  icon.src = iconUrl(w.icon || "01d");
  icon.alt = w.description || "weather";

  $("localTime").textContent = formatLocalTime(data.dt, data.timezone);
}

// --- Packing suggestions ---
export function renderPackingSuggestions(items) {
  const list = $("packingList");
  list.innerHTML = "";
  items.forEach((item, i) => {
    const li = document.createElement("li");
    li.className = "packing-item";
    li.style.animationDelay = `${i * 60}ms`;
    li.setAttribute("data-testid", `pack-item-${i}`);
    // Split emoji + text
    const parts = item.match(/^(\S+)\s+(.*)$/);
    if (parts) {
      li.innerHTML = `<span class="emoji" aria-hidden="true">${parts[1]}</span><span>${parts[2]}</span>`;
    } else {
      li.textContent = item;
    }
    list.appendChild(li);
  });
  $("packCount").textContent = `${items.length} item${items.length !== 1 ? "s" : ""}`;
}

// --- Forecast ---
export function renderForecast(forecastData, unit) {
  const grid = $("forecastGrid");
  grid.innerHTML = "";

  const daily = groupForecastByDay(forecastData.list);
  const days = Object.values(daily).slice(0, 3);

  days.forEach((day, idx) => {
    const w = day.icon?.weather?.[0] || {};
    const card = document.createElement("div");
    card.className = "forecast-card";
    card.setAttribute("data-testid", `forecast-card-${idx}`);
    card.innerHTML = `
      <div>
        <div class="forecast-day">${dayName(day.dateMs)}</div>
        <div class="forecast-cond">${capitalize(w.description || "")}</div>
      </div>
      <div class="forecast-body">
        <img class="forecast-icon" src="${forecastIconUrl(w.icon || "01d")}" alt="${w.description || ""}" />
        <div class="forecast-temps">
          <span class="forecast-max">${formatTemp(day.max, unit)}°${unit}</span>
          <span class="forecast-min">${formatTemp(day.min, unit)}°${unit}</span>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function groupForecastByDay(list) {
  const byDay = {};
  list.forEach((entry) => {
    const dateKey = entry.dt_txt.split(" ")[0];
    if (!byDay[dateKey]) {
      byDay[dateKey] = { min: entry.main.temp_min, max: entry.main.temp_max, icon: entry, dateMs: entry.dt * 1000 };
    } else {
      byDay[dateKey].min = Math.min(byDay[dateKey].min, entry.main.temp_min);
      byDay[dateKey].max = Math.max(byDay[dateKey].max, entry.main.temp_max);
      // prefer midday entry for icon
      if (entry.dt_txt.includes("12:00:00")) byDay[dateKey].icon = entry;
    }
  });
  // Skip today if we have future days
  const keys = Object.keys(byDay).sort();
  const today = new Date().toISOString().split("T")[0];
  const filtered = keys.filter((k) => k > today);
  const result = {};
  (filtered.length ? filtered : keys).forEach((k) => (result[k] = byDay[k]));
  return result;
}

// --- Search history chips ---
export function renderHistory(history, onSelect) {
  const wrap = $("historyWrap");
  const chips = $("historyChips");
  chips.innerHTML = "";
  if (!history || history.length === 0) {
    wrap.hidden = true;
    return;
  }
  history.forEach((city) => {
    const btn = document.createElement("button");
    btn.className = "history-chip";
    btn.textContent = city;
    btn.setAttribute("data-testid", `history-chip-${city}`);
    btn.addEventListener("click", () => onSelect(city));
    chips.appendChild(btn);
  });
  wrap.hidden = false;
}

// Unit toggle UI
export function setActiveUnit(unit) {
  document.querySelectorAll(".unit-btn").forEach((b) => {
    b.classList.toggle("active", b.dataset.unit === unit);
  });
}
