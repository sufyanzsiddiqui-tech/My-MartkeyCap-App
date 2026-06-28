// Display metadata for known symbols. Live price/change come from Finnhub.
export type SymbolMeta = {
  symbol: string;
  name: string;
  logoBg: string;
};

const DEFAULT_BG = "#6b7280";

const META: Record<string, SymbolMeta> = {
  AAPL:  { symbol: "AAPL",  name: "Apple Inc",                  logoBg: "#111827" },
  GOOGL: { symbol: "GOOGL", name: "Alphabet Inc",               logoBg: "#fff"    },
  GOOG:  { symbol: "GOOG",  name: "Alphabet Inc",               logoBg: "#fff"    },
  MSFT:  { symbol: "MSFT",  name: "Microsoft Corp",             logoBg: "#737373" },
  TSLA:  { symbol: "TSLA",  name: "Tesla Inc",                  logoBg: "#dc2626" },
  AMZN:  { symbol: "AMZN",  name: "Amazon.com Inc",             logoBg: "#ff9900" },
  META:  { symbol: "META",  name: "Meta Platforms Inc",         logoBg: "#1877f2" },
  NVDA:  { symbol: "NVDA",  name: "NVIDIA Corp",                logoBg: "#76b900" },
  SPOT:  { symbol: "SPOT",  name: "Spotify Technology SA",      logoBg: "#1db954" },
  NFLX:  { symbol: "NFLX",  name: "Netflix Inc",                logoBg: "#e50914" },
};

export function metaFor(symbol: string): SymbolMeta {
  return META[symbol.toUpperCase()] ?? { symbol, name: symbol, logoBg: DEFAULT_BG };
}

// Shown to users with an empty watchlist (free plan, or paid users who haven't
// added anything yet) so the dashboard is never blank.
export const DEFAULT_SYMBOLS = ["AAPL", "MSFT", "GOOGL", "NVDA", "TSLA", "META", "AMZN", "NFLX"];

// Curated pool we sort by today's % change to surface "Recommended Buys".
export const TOP_STOCKS_POOL = DEFAULT_SYMBOLS;
export const RECOMMENDED_POOL = [
  ...DEFAULT_SYMBOLS,
  "AMD", "INTC", "ADBE", "CRM", "ORCL", "AVGO", "JPM", "V",
];

// Free-tier Finnhub doesn't surface most-actives; these are typically the
// highest-volume US large-caps.
export const TOP_TRADED_SYMBOLS = ["TSLA", "NVDA", "AAPL", "AMD", "AMZN"];

export type StatPoint = { day: string; value: number };

export const statisticsData: StatPoint[] = [
  { day: "Dec 2", value: 42000 },
  { day: "Dec 3", value: 39500 },
  { day: "Dec 4", value: 41000 },
  { day: "Dec 5", value: 38000 },
  { day: "Dec 6", value: 40500 },
  { day: "Dec 7", value: 25500 },
  { day: "Dec 8", value: 43000 },
  { day: "Dec 9", value: 41500 },
  { day: "Dec 10", value: 45000 },
];

export function fmtMoney(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(n);
}
