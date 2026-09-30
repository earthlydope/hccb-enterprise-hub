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
