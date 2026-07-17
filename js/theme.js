// theme.js — updates CSS variables based on weather condition

const themes = {
  Clear: {
    light: true,
    vars: {
      "--bg-start": "#ffb347",
      "--bg-end": "#ffcc70",
      "--accent": "#ff7a00",
      "--accent-strong": "#e26200",
      "--text": "#2a1a05",
      "--text-muted": "#6b4b1e",
      "--card-bg": "rgba(255,255,255,0.45)",
      "--card-border": "rgba(255,255,255,0.6)",
    },
  },
  Clouds: {
    light: false,
    vars: {
      "--bg-start": "#4a5568",
      "--bg-end": "#2d3748",
      "--accent": "#cbd5e1",
      "--accent-strong": "#a0aec0",
      "--text": "#f4f6fb",
      "--text-muted": "#c0c7d4",
      "--card-bg": "rgba(255,255,255,0.06)",
      "--card-border": "rgba(255,255,255,0.15)",
    },
  },
  Rain: {
    light: false,
    vars: {
      "--bg-start": "#1e3a5f",
      "--bg-end": "#33475f",
      "--accent": "#7fb8ff",
      "--accent-strong": "#4f9dff",
      "--text": "#eef4ff",
      "--text-muted": "#a9b6cc",
      "--card-bg": "rgba(255,255,255,0.07)",
      "--card-border": "rgba(255,255,255,0.14)",
    },
  },
  Drizzle: {
    light: false,
    vars: {
      "--bg-start": "#25476b",
      "--bg-end": "#3a5a7e",
      "--accent": "#8fc6ff",
      "--accent-strong": "#5aa8ff",
      "--text": "#eef4ff",
      "--text-muted": "#b0bccf",
      "--card-bg": "rgba(255,255,255,0.07)",
      "--card-border": "rgba(255,255,255,0.14)",
    },
  },
  Thunderstorm: {
    light: false,
    vars: {
      "--bg-start": "#151824",
      "--bg-end": "#26304a",
      "--accent": "#ffd166",
      "--accent-strong": "#f0b429",
      "--text": "#f0f2f8",
      "--text-muted": "#a4acbf",
      "--card-bg": "rgba(255,255,255,0.06)",
      "--card-border": "rgba(255,255,255,0.14)",
    },
  },
  Snow: {
    light: true,
    vars: {
      "--bg-start": "#dbeafe",
      "--bg-end": "#f0f9ff",
      "--accent": "#3b82f6",
      "--accent-strong": "#1d4ed8",
      "--text": "#17233b",
      "--text-muted": "#4b5b7a",
      "--card-bg": "rgba(255,255,255,0.65)",
      "--card-border": "rgba(255,255,255,0.75)",
    },
  },
  Mist: {
    light: false,
    vars: {
      "--bg-start": "#546e7a",
      "--bg-end": "#78909c",
      "--accent": "#e0f2f1",
      "--accent-strong": "#b2dfdb",
      "--text": "#f4f6fb",
      "--text-muted": "#cfd6dd",
      "--card-bg": "rgba(255,255,255,0.10)",
      "--card-border": "rgba(255,255,255,0.20)",
    },
  },
  Default: {
    light: false,
    vars: {
      "--bg-start": "#0f1a2b",
      "--bg-end": "#1c2d4a",
      "--accent": "#7fb8ff",
      "--accent-strong": "#4f9dff",
      "--text": "#eef4ff",
      "--text-muted": "#a9b6cc",
      "--card-bg": "rgba(255,255,255,0.06)",
      "--card-border": "rgba(255,255,255,0.12)",
    },
  },
};

// Aliases for less common main conditions
const aliasMap = {
  Haze: "Mist",
  Fog: "Mist",
  Smoke: "Mist",
  Dust: "Mist",
  Sand: "Mist",
  Ash: "Mist",
  Squall: "Rain",
  Tornado: "Thunderstorm",
};

export function applyTheme(condition, tempC = null) {
  const key = aliasMap[condition] || (themes[condition] ? condition : "Default");
  let theme = themes[key];

  // Special case: Clear + hot uses warm palette (already default for Clear)
  if (key === "Clear" && typeof tempC === "number" && tempC < 15) {
    // Cool clear day — softer palette
    theme = {
      light: false,
      vars: {
        "--bg-start": "#2b3e60",
        "--bg-end": "#4a6a97",
        "--accent": "#ffd580",
        "--accent-strong": "#ffb84d",
        "--text": "#eef4ff",
        "--text-muted": "#b7c1d6",
        "--card-bg": "rgba(255,255,255,0.08)",
        "--card-border": "rgba(255,255,255,0.16)",
      },
    };
  }

  const root = document.documentElement;
  Object.entries(theme.vars).forEach(([k, v]) => root.style.setProperty(k, v));
  document.body.classList.toggle("theme-light", !!theme.light);
}
