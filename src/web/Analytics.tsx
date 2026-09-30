import { useState } from "react";
import { Icon } from "../ui";
import {
  byAge,
  byDevice,
  byFormat,
  byFunction,
  byHour,
  byLanguage,
  byZone,
  headlineCards,
  insights,
  reachHeadline,
  storyRows,
} from "../analytics";
import { BarList, Delta, Donut, Funnel, HourChart } from "./charts";

const ranges = ["Last 7 days", "Last 30 days", "This quarter"] as const;

export function WebAnalytics() {
  const [range, setRange] = useState<(typeof ranges)[number]>("Last 30 days");
  const [cut, setCut] = useState<"Zone" | "Function" | "Age group" | "Language">("Zone");

  const cutRows =
    cut === "Zone" ? byZone : cut === "Function" ? byFunction : cut === "Age group" ? byAge : byLanguage;

  return (
    <>
      <h1 className="wa-h1">Communications analytics</h1>
      <p className="wa-lede">
        Who a message reached, who opened it, who finished it — and which format is still working.
        Cut by zone, function, age group, language, device and hour of day.
      </p>

      <div className="wa-pill-row">
        {ranges.map((r) => (
          <button key={r} className={range === r ? "wa-pill on" : "wa-pill"} onClick={() => setRange(r)}>
            {r}
          </button>
        ))}
        <span style={{ flex: 1 }} />
        <button className="wa-pill">
          <Icon name="download" size={15} /> Export
        </button>
      </div>

      {/* ---------- Headline ---------- */}
      <div className="wa-grid wa-g4">
        {headlineCards.map((c) => (
          <div key={c.id} className="wa-card wa-kpi">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span className="l">{c.label}</span>
              <Delta value={c.delta} />
            </div>
            <span className="v">{c.value}</span>
            <span className="s">{c.sub}</span>
          </div>
        ))}
      </div>

      {/* ---------- Funnel ---------- */}
      <div className="wa-sec">
        <h2>From published to acted on</h2>
        <span className="wa-sub">{range} · all communications</span>
      </div>
      <div className="wa-card">
        <Funnel
          steps={[
            { label: "Audience", value: reachHeadline.audience },
            { label: "Reached", value: reachHeadline.reached },
            { label: "Opened", value: reachHeadline.opened },
            { label: "Read through", value: reachHeadline.readThrough },
            { label: "Acted", value: reachHeadline.acted },
          ]}
        />
        <p className="wa-sub" style={{ marginTop: 14 }}>
          Drop-off is steepest between opened and read-through — the signal that length and format,
          not distribution, are the constraint.
        </p>
      </div>

      {/* ---------- Audience cuts ---------- */}
      <div className="wa-split" style={{ marginTop: 26 }}>
        <div className="wa-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, gap: 10, flexWrap: "wrap" }}>
            <div>
              <h3>Open rate by {cut.toLowerCase()}</h3>
              <p className="wa-sub">Share of the targeted audience that opened at least one item</p>
            </div>
            <div className="wa-pill-row" style={{ margin: 0 }}>
              {(["Zone", "Function", "Age group", "Language"] as const).map((c) => (
                <button key={c} className={cut === c ? "wa-pill on" : "wa-pill"} onClick={() => setCut(c)}>
                  {c}
                </button>
              ))}
            </div>
          </div>
          <BarList rows={cutRows} />
          {cut === "Zone" && (
            <p className="wa-sub" style={{ marginTop: 10 }}>
              East trails South by 31 points. Language coverage is the first thing to check.
            </p>
          )}
          {cut === "Function" && (
            <p className="wa-sub" style={{ marginTop: 10 }}>
              Manufacturing is up 12 points since plant TV screens joined the channel mix.
            </p>
          )}
          {cut === "Age group" && (
            <p className="wa-sub" style={{ marginTop: 10 }}>
              Under-30s moved most (+14) — they are the population that adopted mobile first.
            </p>
          )}
          {cut === "Language" && (
            <p className="wa-sub" style={{ marginTop: 10 }}>
              42% of opens are in a language other than English. Vernacular is not optional.
            </p>
          )}
        </div>

        <div className="wa-card">
          <h3>Device mix</h3>
          <p className="wa-sub" style={{ marginBottom: 14 }}>Where employees actually read</p>
          <Donut data={byDevice} />
          <p className="wa-sub" style={{ marginTop: 14 }}>
            Three in four opens are on a phone. Plant TV screens carry the shift-floor population
            that never opens a laptop.
          </p>
        </div>
      </div>

      {/* ---------- When to publish ---------- */}
      <div className="wa-sec">
        <h2>When people actually read</h2>
        <span className="wa-sub">Opens by hour · peaks highlighted</span>
      </div>
      <div className="wa-card">
        <HourChart data={byHour} />
        <p className="wa-sub" style={{ marginTop: 12 }}>
          Two peaks — 09:00 at shift start and 18:00 on the commute. A midday send loses roughly
          half the opens of a 09:00 send.
        </p>
      </div>

      {/* ---------- Format performance ---------- */}
      <div className="wa-sec">
        <h2>Which format of communication works</h2>
        <span className="wa-sub">Same audience, different treatment</span>
      </div>
      <div className="wa-card">
        <table className="wa-table">
          <thead>
            <tr>
              <th>Format</th>
              <th>Sent</th>
              <th>Open rate</th>
              <th>Completion</th>
              <th>Interactions</th>
              <th>Verdict</th>
            </tr>
          </thead>
          <tbody>
            {byFormat.map((f) => (
              <tr key={f.id}>
                <td className="t">
                  {f.format}
                  <br />
                  <small className="wa-sub">{f.hint}</small>
                </td>
                <td className="n">{f.sent}</td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div className="wa-bar" style={{ width: 70 }}>
                      <span style={{ width: `${f.openRate}%` }} />
                    </div>
                    <b style={{ fontSize: 12.5 }}>{f.openRate}%</b>
                  </div>
                </td>
                <td className="n">{f.completion}%</td>
                <td className="n">{f.interactions.toLocaleString("en-IN")}</td>
                <td>
                  <span
                    className={`tag ${f.verdict === "Working" ? "done" : f.verdict === "Fading" ? "crit" : "high"}`}
                  >
                    {f.verdict}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ---------- Story performance + insights ---------- */}
      <div className="wa-split" style={{ marginTop: 26 }}>
        <div className="wa-card">
          <h3>Story performance</h3>
          <p className="wa-sub" style={{ marginBottom: 14 }}>Published this month</p>
          <table className="wa-table">
            <thead>
              <tr>
                <th>Story</th>
                <th>Reach</th>
                <th>Open</th>
                <th>Avg time</th>
                <th>Strongest in</th>
              </tr>
            </thead>
            <tbody>
              {storyRows.map((s) => (
                <tr key={s.id}>
                  <td className="t">
                    {s.title}
                    <br />
                    <small className="wa-sub">
                      {s.format} · {s.published}
                    </small>
                  </td>
                  <td className="n">{s.reach.toLocaleString("en-IN")}</td>
                  <td className="n">{s.openRate}%</td>
                  <td className="n">
                    {Math.floor(s.avgSeconds / 60)}m {s.avgSeconds % 60}s
                  </td>
                  <td>
                    <small className="wa-sub">
                      {s.topZone} · {s.topFunction}
                    </small>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="wa-card">
          <h3>What this is telling you</h3>
          <p className="wa-sub" style={{ marginBottom: 6 }}>Generated from the cuts above</p>
          {insights.map((i) => (
            <div key={i.id} className={`wa-insight ${i.tone}`}>
              <i>
                <Icon name={i.tone === "good" ? "trending_up" : "warning"} size={16} />
              </i>
              <div>
                <b>{i.title}</b>
                <p>{i.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
