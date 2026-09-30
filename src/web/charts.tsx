import type { Trend } from "../analytics";

export function Delta({ value }: { value?: number }) {
  if (value === undefined) return null;
  const up = value >= 0;
  return (
    <span className={up ? "wa-delta up" : "wa-delta down"}>
      {up ? "▲" : "▼"} {Math.abs(value)}
    </span>
  );
}

export function BarList({ rows, alt, suffix = "%" }: { rows: Trend[]; alt?: boolean; suffix?: string }) {
  const max = Math.max(...rows.map((r) => r.value), 1);
  return (
    <div>
      {rows.map((r) => (
        <div className="wa-bar-row" key={r.label}>
          <span className="lbl">{r.label}</span>
          <div className={alt ? "wa-bar alt" : "wa-bar"}>
            <span style={{ width: `${(r.value / max) * 100}%` }} />
          </div>
          <span className="val">
            {r.value}
            {suffix}
          </span>
        </div>
      ))}
    </div>
  );
}

/** Opens-by-hour column chart. The two tallest hours are highlighted. */
export function HourChart({ data }: { data: { h: number; v: number }[] }) {
  const max = Math.max(...data.map((d) => d.v), 1);
  const peak = [...data].sort((a, b) => b.v - a.v).slice(0, 2).map((d) => d.h);
  return (
    <div className="wa-hours">
      {data.map((d) => (
        <div key={d.h} className={peak.includes(d.h) ? "peak" : ""} title={`${d.h}:00 — ${d.v} opens`}>
          <u style={{ height: `${Math.max(6, (d.v / max) * 100)}%` }} />
          <small>{d.h}</small>
        </div>
      ))}
    </div>
  );
}

export function Donut({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const r = 52;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="wa-donut">
      <svg width="132" height="132" viewBox="0 0 132 132" aria-hidden>
        <circle cx="66" cy="66" r={r} fill="none" stroke="rgba(17,17,20,0.06)" strokeWidth="18" />
        {data.map((d) => {
          const len = (d.value / total) * c;
          const el = (
            <circle
              key={d.label}
              cx="66"
              cy="66"
              r={r}
              fill="none"
              stroke={d.color}
              strokeWidth="18"
              strokeDasharray={`${len} ${c - len}`}
              strokeDashoffset={-offset}
              transform="rotate(-90 66 66)"
              strokeLinecap="butt"
            />
          );
          offset += len;
          return el;
        })}
        <text x="66" y="62" textAnchor="middle" fontSize="23" fontWeight="700" fill="#111114" letterSpacing="-1">
          {data[0].value}%
        </text>
        <text x="66" y="78" textAnchor="middle" fontSize="10" fill="#6b6b73">
          {data[0].label}
        </text>
      </svg>
      <div className="wa-donut-legend">
        {data.map((d) => (
          <div key={d.label}>
            <i style={{ background: d.color }} />
            {d.label}
            <b>{d.value}%</b>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Funnel({ steps }: { steps: { label: string; value: number }[] }) {
  const max = Math.max(...steps.map((s) => s.value), 1);
  return (
    <div className="wa-funnel">
      {steps.map((s) => (
        <div key={s.label}>
          <u style={{ height: `${Math.max(14, (s.value / max) * 118)}px` }} />
          <b>{s.value.toLocaleString("en-IN")}</b>
          <small>{s.label}</small>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * People analytics + engagement heat primitives
 * ------------------------------------------------------------------ */

/** Joiners vs leavers, one pair of columns per month. */
export function ColumnPair({
  labels,
  a,
  b,
  aLabel = "Joiners",
  bLabel = "Leavers",
  height = 150,
}: {
  labels: string[];
  a: number[];
  b: number[];
  aLabel?: string;
  bLabel?: string;
  height?: number;
}) {
  const max = Math.max(1, ...a, ...b);
  return (
    <div>
      <div className="cp" style={{ height }}>
        {labels.map((l, i) => (
          <div key={l} className="cp-col" title={`${l}: ${a[i]} ${aLabel.toLowerCase()}, ${b[i]} ${bLabel.toLowerCase()}`}>
            <div className="cp-bars">
              <u className="cp-a" style={{ height: `${(a[i] / max) * 100}%` }} />
              <u className="cp-b" style={{ height: `${(b[i] / max) * 100}%` }} />
            </div>
            <small>{l}</small>
          </div>
        ))}
      </div>
      <div className="cp-legend">
        <span>
          <i className="cp-a" /> {aLabel}
        </span>
        <span>
          <i className="cp-b" /> {bLabel}
        </span>
      </div>
    </div>
  );
}

/** Area + line trend with a dashed target line. */
export function TrendLine({
  labels,
  data,
  target,
  suffix = "%",
  height = 150,
  color = "#f40009",
}: {
  labels: string[];
  data: number[];
  target?: number;
  suffix?: string;
  height?: number;
  color?: string;
}) {
  const W = 600;
  const H = height;
  const pad = { l: 34, r: 12, t: 12, b: 22 };
  const lo = Math.min(...data, target ?? Infinity) * 0.9;
  const hi = Math.max(...data, target ?? -Infinity) * 1.08;
  const x = (i: number) => pad.l + (i / Math.max(1, data.length - 1)) * (W - pad.l - pad.r);
  const y = (v: number) => pad.t + (1 - (v - lo) / (hi - lo || 1)) * (H - pad.t - pad.b);
  const line = data.map((v, i) => `${x(i)},${y(v)}`).join(" ");
  const area = `${pad.l},${H - pad.b} ${line} ${x(data.length - 1)},${H - pad.b}`;
  const ticks = [lo, (lo + hi) / 2, hi];
  const gid = `tl-${color.replace("#", "")}`;
  return (
    <svg className="tl" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ height }}>
      <defs>
        <linearGradient id={gid} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} stroke="rgba(17,17,20,0.06)" />
          <text x={pad.l - 6} y={y(t) + 3} textAnchor="end" fontSize="10" fill="#8b8b94">
            {Math.round(t * 10) / 10}
            {suffix}
          </text>
        </g>
      ))}
      {target !== undefined && (
        <line x1={pad.l} x2={W - pad.r} y1={y(target)} y2={y(target)} stroke="#0f172a" strokeDasharray="4 4" strokeOpacity="0.45" />
      )}
      <polygon points={area} fill={`url(#${gid})`} />
      <polyline points={line} fill="none" stroke={color} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      {data.map((v, i) => (
        <circle key={i} cx={x(i)} cy={y(v)} r="2.6" fill="#fff" stroke={color} strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
      ))}
      {labels.map((l, i) => (
        <text key={l} x={x(i)} y={H - 6} textAnchor="middle" fontSize="10" fill="#8b8b94">
          {l}
        </text>
      ))}
    </svg>
  );
}

/** A single 100%-stacked bar with a legend. */
export function StackBar({ parts }: { parts: { label: string; value: number; color: string }[] }) {
  const total = parts.reduce((s, p) => s + p.value, 0) || 1;
  return (
    <div>
      <div className="sb">
        {parts.map((p) => (
          <span key={p.label} style={{ width: `${(p.value / total) * 100}%`, background: p.color }} title={`${p.label} ${Math.round((p.value / total) * 100)}%`} />
        ))}
      </div>
      <div className="sb-legend">
        {parts.map((p) => (
          <span key={p.label}>
            <i style={{ background: p.color }} />
            {p.label} <b>{Math.round((p.value / total) * 100)}%</b>
          </span>
        ))}
      </div>
    </div>
  );
}

/** Plain column histogram — tenure bands, rating distribution. */
export function Columns({
  labels,
  values,
  height = 120,
  highlight,
  format = (v: number) => `${Math.round(v * 100)}%`,
}: {
  labels: readonly string[];
  values: number[];
  height?: number;
  highlight?: number;
  format?: (v: number) => string;
}) {
  const max = Math.max(1e-9, ...values);
  return (
    <div className="cols" style={{ height }}>
      {values.map((v, i) => (
        <div key={labels[i]} className={i === highlight ? "cols-c on" : "cols-c"}>
          <b>{format(v)}</b>
          <u style={{ height: `${Math.max(4, (v / max) * 100)}%` }} />
          <small>{labels[i]}</small>
        </div>
      ))}
    </div>
  );
}

export function Sparkline({ data, w = 90, h = 26, color = "#f40009" }: { data: number[]; w?: number; h?: number; color?: string }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const pts = data.map((v, i) => `${(i / Math.max(1, data.length - 1)) * w},${h - ((v - min) / span) * (h - 4) - 2}`).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export function SentimentBar({ pos, neu, neg }: { pos: number; neu: number; neg: number }) {
  return (
    <div className="sent" title={`${pos}% positive · ${neu}% neutral · ${neg}% negative`}>
      <span style={{ width: `${pos}%`, background: "#34c759" }} />
      <span style={{ width: `${neu}%`, background: "#c7c7cc" }} />
      <span style={{ width: `${neg}%`, background: "#f40009" }} />
    </div>
  );
}

/** Red intensity scale for heat cells. */
export function heatColor(v: number) {
  const a = 0.06 + (v / 100) * 0.86;
  return `rgba(244, 0, 9, ${a.toFixed(3)})`;
}

/** Green→amber→red for compliance-style percentages (higher is better). */
export function scoreColor(v: number, good = 92, bad = 75) {
  if (v >= good) return "rgba(52, 199, 89, 0.18)";
  if (v <= bad) return "rgba(244, 0, 9, 0.14)";
  return "rgba(255, 159, 10, 0.18)";
}
