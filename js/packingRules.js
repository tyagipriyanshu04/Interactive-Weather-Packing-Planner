// packingRules.js — data-driven rules engine

const rules = [
  {
    id: "rain",
    match: ({ main }) =>
      ["Rain", "Drizzle", "Thunderstorm"].includes(main),
    items: ["☔ Pack an umbrella", "🧥 Waterproof jacket"],
  },
  {
    id: "snow",
    match: ({ main }) => main === "Snow",
    items: ["🥾 Waterproof boots", "🧣 Warm scarf"],
  },
  {
    id: "cold",
    match: ({ tempC }) => tempC < 10,
    items: ["🧥 Heavy coat", "🧤 Gloves", "🧦 Warm socks"],
  },
  {
    id: "hot",
    match: ({ tempC }) => tempC > 30,
    items: ["🩳 Light clothing", "🧴 Sunscreen", "🕶️ Sunglasses"],
  },
  {
    id: "humid",
    match: ({ humidity }) => humidity > 70,
    items: ["👕 Breathable fabrics recommended"],
  },
  {
    id: "windy",
    match: ({ windMs }) => windMs > 10,
    items: ["🧢 Windbreaker"],
  },
  {
    id: "clear-hot",
    match: ({ main, tempC }) => main === "Clear" && tempC >= 20 && tempC <= 30,
    items: ["🧢 Cap or hat"],
  },
];

export function getPackingSuggestions({ main, tempC, humidity, windMs }) {
  const ctx = { main, tempC, humidity, windMs };
  const set = new Set();
  for (const rule of rules) {
    if (rule.match(ctx)) rule.items.forEach((i) => set.add(i));
  }
  if (set.size === 0) set.add("🎒 Standard travel essentials");
  return [...set];
}
