import { useSyncExternalStore } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "./ui";

/**
 * IPO-year share ticker.
 *
 * HCCB is not listed yet, so there is no real price. This runs a simulated
 * feed — a mean-reverting random walk — clearly labelled as such everywhere it
 * renders. At listing, replace `tick()` with the exchange feed; the component
 * contract (price, open, high, low, history) stays the same.
 */

const BASE = 412.5;
const HISTORY = 48;

type Quote = { price: number; open: number; high: number; low: number; history: number[]; at: number };

const round2 = (v: number) => Math.round(v * 100) / 100;

function next(p: number) {
  const drift = (BASE - p) * 0.03;
  const shock = (Math.random() - 0.5) * p * 0.0042;
  return round2(p + drift + shock);
}

function seed(): Quote {
  const history: number[] = [];
  let p = BASE - 3.4;
  for (let i = 0; i < HISTORY; i++) {
    p = next(p);
    history.push(p);
  }
  return {
    price: p,
    open: round2(BASE - 3.4),
    high: Math.max(...history),
    low: Math.min(...history),
    history,
    at: Date.now(),
  };
}

let quote: Quote = seed();
const listeners = new Set<() => void>();
let timer: number | undefined;

function tick() {
  const price = next(quote.price);
  const history = [...quote.history.slice(1), price];
  quote = {
    price,
    open: quote.open,
    high: Math.max(quote.high, price),
    low: Math.min(quote.low, price),
    history,
    at: Date.now(),
  };
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  if (timer === undefined) timer = window.setInterval(tick, 2400);
  return () => {
    listeners.delete(l);
    if (!listeners.size && timer !== undefined) {
      window.clearInterval(timer);
      timer = undefined;
    }
  };
}

export function useQuote() {
  return useSyncExternalStore(subscribe, () => quote, () => quote);
}

function Spark({ data, up, w = 84, h = 26 }: { data: number[]; up: boolean; w?: number; h?: number }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / span) * (h - 4) - 2}`).join(" ");
  const color = up ? "#1a7f37" : "#f40009";
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden className="tk-spark">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

const updates = [
  "IPO year · employee FAQ in Leadership Corner",
  "Townhall · 24 Sep, 3:00 PM IST",
  "Water Positive 2026 · pledges close 30 Sep",
  "Payroll cut-off · 24 Sep, 6:00 PM",
  "CEO Talks · questions open until 24 Sep",
];

export function StockTicker({ variant }: { variant: "web" | "mobile" }) {
  const q = useQuote();
  const nav = useNavigate();
  const change = round2(q.price - q.open);
  const pct = round2((change / q.open) * 100);
  const up = change >= 0;

  if (variant === "mobile") {
    return (
      <button className="tk-m" onClick={() => nav("/leadership")} data-hint="tk-mobile">
        <div className="tk-m-left">
          <span className="tk-sym">HCCB</span>
          <span className="tk-sim">Simulated</span>
        </div>
        <div className="tk-m-mid">
          <b>₹{q.price.toFixed(2)}</b>
          <span className={up ? "tk-up" : "tk-down"}>
            {up ? "▲" : "▼"} {Math.abs(change).toFixed(2)} ({Math.abs(pct).toFixed(2)}%)
          </span>
        </div>
        <Spark data={q.history} up={up} w={70} h={24} />
        <small className="tk-m-note">IPO year · pre-listing preview — the exchange feed connects at listing</small>
      </button>
    );
  }

  return (
    <div className="tk-w" data-hint="tk-web">
      <div className="tk-w-quote">
        <span className="tk-sim">
          <i /> Simulated
        </span>
        <span className="tk-sym">HCCB</span>
        <b>₹{q.price.toFixed(2)}</b>
        <span className={up ? "tk-up" : "tk-down"}>
          {up ? "▲" : "▼"} {Math.abs(change).toFixed(2)} ({Math.abs(pct).toFixed(2)}%)
        </span>
        <Spark data={q.history} up={up} />
        <span className="tk-range">
          Day {q.low.toFixed(2)} – {q.high.toFixed(2)}
        </span>
      </div>
      <div className="tk-w-roll" aria-hidden>
        <div className="tk-w-track">
          {[...updates, ...updates].map((u, i) => (
            <span key={i}>
              <Icon name="campaign" size={13} /> {u}
            </span>
          ))}
        </div>
      </div>
      <span className="tk-w-note">Pre-listing preview</span>
    </div>
  );
}
