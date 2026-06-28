const BASE = "https://finnhub.io/api/v1";

export type FinnhubQuote = {
  c: number;  // current price
  d: number;  // change
  dp: number; // percent change
  h: number;  // high
  l: number;  // low
  o: number;  // open
  pc: number; // previous close
  t: number;  // timestamp
};

function key() {
  const k = process.env.FINNHUB_API_KEY;
  if (!k) throw new Error("FINNHUB_API_KEY missing — set it in .env.local");
  return k;
}

export async function fetchQuote(symbol: string): Promise<FinnhubQuote> {
  const url = `${BASE}/quote?symbol=${encodeURIComponent(symbol)}&token=${key()}`;
  const res = await fetch(url, { next: { revalidate: 15 } });
  if (!res.ok) throw new Error(`Finnhub quote ${symbol} failed: ${res.status}`);
  return res.json();
}

export type FinnhubSearchResult = {
  count: number;
  result: Array<{
    description: string;
    displaySymbol: string;
    symbol: string;
    type: string;
  }>;
};

export async function searchSymbols(q: string): Promise<FinnhubSearchResult> {
  const url = `${BASE}/search?q=${encodeURIComponent(q)}&exchange=US&token=${key()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Finnhub search failed: ${res.status}`);
  return res.json();
}

export type Candle = {
  c: number[]; h: number[]; l: number[]; o: number[]; t: number[]; v: number[];
  s: "ok" | "no_data";
};

export async function fetchCandles(
  symbol: string,
  resolution: string,
  from: number,
  to: number
): Promise<Candle> {
  const url = `${BASE}/stock/candle?symbol=${encodeURIComponent(symbol)}&resolution=${resolution}&from=${from}&to=${to}&token=${key()}`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`Finnhub candles failed: ${res.status}`);
  return res.json();
}

export type CompanyNews = Array<{
  category: string;
  datetime: number;
  headline: string;
  id: number;
  image: string;
  related: string;
  source: string;
  summary: string;
  url: string;
}>;

export async function fetchCompanyNews(
  symbol: string,
  fromDate: string,
  toDate: string
): Promise<CompanyNews> {
  const url = `${BASE}/company-news?symbol=${encodeURIComponent(symbol)}&from=${fromDate}&to=${toDate}&token=${key()}`;
  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`Finnhub news failed: ${res.status}`);
  return res.json();
}

export type CompanyProfile = {
  country: string;
  currency: string;
  exchange: string;
  ipo: string;
  marketCapitalization: number;
  name: string;
  phone: string;
  shareOutstanding: number;
  ticker: string;
  weburl: string;
  logo: string;
  finnhubIndustry: string;
};

export async function fetchProfile(symbol: string): Promise<CompanyProfile> {
  const url = `${BASE}/stock/profile2?symbol=${encodeURIComponent(symbol)}&token=${key()}`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`Finnhub profile failed: ${res.status}`);
  return res.json();
}
