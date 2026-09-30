import { useMemo, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Icon, ScreenHeader } from "../ui";
import { useHub } from "../store";
import { isHR } from "../personas";
import {
  departments,
  deptName,
  GENERATIONS,
  MODULES,
  peopleInsights,
  peopleView,
  riskDrivers,
  siteOverdue,
  TENURE_BANDS,
  ZONES,
  type DeptId,
  type Period,
  type ZoneId,
} from "../hr";
import { HEAT_CHANNELS, heatTotals, needsAttention, rankedHeat, topicZoneMatrix, type HeatChannel } from "../heat";
import {
  BarList,
  ColumnPair,
  Columns,
  Funnel,
  heatColor,
  SentimentBar,
  Sparkline,
  StackBar,
  TrendLine,
} from "../web/charts";

/** Mobile gate — same rule as the web: full analytics is HR-only. */
export function MobileRequireHR({ title, children }: { title: string; children: ReactNode }) {
  const { user } = useHub();
  const nav = useNavigate();
  if (isHR(user)) return <>{children}</>;
  return (
    <>
      <ScreenHeader title={title} />
      <div className="scroll">
        <div className="card" style={{ textAlign: "center", marginTop: 20 }}>
          <Icon name="lock" size={30} />
          <h2 className="h2" style={{ margin: "10px 0 6px", fontSize: 18 }}>Restricted to HR</h2>
          <p className="muted" style={{ fontSize: 14 }}>
            People analytics and engagement heat are available to the HR analytics team. Your own
            leave, training and requests are in Workspace.
          </p>
          <button className="cta" onClick={() => nav("/workspace")}>
            Open Workspace
          </button>
        </div>
      </div>
    </>
  );
}

const MTABS = ["Overview", "Workforce", "Retention", "Learning", "Hiring"] as const;

function MKpi({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="card m-kpi">
      <span>{label}</span>
      <b>{value}</b>
      <small>{sub}</small>
    </div>
  );
}

export function MobilePeople() {
  const [dept, setDept] = useState<DeptId | "all">("all");
  const [zone, setZone] = useState<ZoneId | "all">("all");
  const [period, setPeriod] = useState<Period>("6M");
  const [tab, setTab] = useState<(typeof MTABS)[number]>("Overview");
  const v = useMemo(() => peopleView({ dept, zone, period }), [dept, zone, period]);
  const insights = useMemo(() => peopleInsights(v), [v]);

  return (
    <MobileRequireHR title="People analytics">
      <ScreenHeader title="People analytics" />
      <div className="scroll">
        <div className="between" style={{ alignItems: "baseline" }}>
          <h1 className="h1" style={{ fontSize: 24, margin: 0 }}>People pulse</h1>
          <span className="tag high">Illustrative</span>
        </div>
        <p className="tiny" style={{ margin: "4px 0 12px" }}>
          {deptName(dept)} · {zone === "all" ? "All zones" : zone} · last {v.months} months
        </p>

        <div className="filters" data-hint="m-hr-filters">
          {(["all", ...departments.map((d) => d.id)] as (DeptId | "all")[]).map((d) => (
            <button key={d} className={dept === d ? "filter on" : "filter"} onClick={() => setDept(d)}>
              {d === "all" ? "All" : departments.find((x) => x.id === d)!.name}
            </button>
          ))}
        </div>
        <div className="filters" style={{ paddingTop: 0 }}>
          {(["all", ...ZONES] as (ZoneId | "all")[]).map((z) => (
            <button key={z} className={zone === z ? "filter on" : "filter"} onClick={() => setZone(z)}>
              {z === "all" ? "All zones" : z}
            </button>
          ))}
          <span style={{ width: 8, flexShrink: 0 }} />
          {(["3M", "6M", "12M"] as Period[]).map((p) => (
            <button key={p} className={period === p ? "filter on" : "filter"} onClick={() => setPeriod(p)}>
              {p}
            </button>
          ))}
        </div>

        <div className="m-kpis">
          <MKpi label="Headcount" value={v.headcount.toLocaleString("en-IN")} sub={`${v.netChange >= 0 ? "+" : ""}${v.netChange} net`} />
          <MKpi label="Attrition" value={`${v.attrition}%`} sub={`${v.voluntary}% voluntary`} />
          <MKpi label="Training" value={`${v.training}%`} sub={`${v.overdue.toLocaleString("en-IN")} overdue`} />
          <MKpi label="eNPS" value={v.eNPS > 0 ? `+${v.eNPS}` : `${v.eNPS}`} sub={`Pulse ${v.pulse}/5`} />
          <MKpi label="Absenteeism" value={`${v.absenteeism}%`} sub={`${v.overtime}h overtime`} />
          <MKpi label="Open roles" value={String(v.openRoles)} sub={`${v.timeToFill}d to fill`} />
        </div>

        <div className="m-seg" data-hint="m-hr-tabs">
          {MTABS.map((t) => (
            <button key={t} className={tab === t ? "on" : ""} onClick={() => setTab(t)}>
              {t}
            </button>
          ))}
        </div>

        {tab === "Overview" && (
          <>
            <div className="card m-chart">
              <b>Headcount movement</b>
              <small>Joiners against leavers</small>
              <ColumnPair labels={v.labels} a={v.joinersSeries} b={v.leaversSeries} height={120} />
            </div>
            <div className="card m-chart">
              <b>Attrition trend</b>
              <small>Annualised · dashed line is the 12% target</small>
              <TrendLine labels={v.labels} data={v.attritionTrend} target={12} height={130} />
            </div>
            <div className="card m-chart">
              <b>What this is telling you</b>
              {insights.slice(0, 3).map((i) => (
                <div key={i.title} className={`wa-insight ${i.tone}`}>
                  <i>
                    <Icon name={i.tone === "good" ? "trending_up" : "warning"} size={15} />
                  </i>
                  <div>
                    <b>{i.title}</b>
                    <p>{i.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "Workforce" && (
          <>
            <div className="card m-chart">
              <b>Generations</b>
              <small>Average age {v.avgAge}</small>
              <StackBar parts={GENERATIONS.map((g, i) => ({ label: g, value: v.generations[i], color: ["#f40009", "#0f172a", "#d97706"][i] }))} />
            </div>
            <div className="card m-chart">
              <b>Tenure</b>
              <small>Average {v.avgTenure} years</small>
              <Columns labels={TENURE_BANDS} values={v.tenure} highlight={v.tenure.indexOf(Math.max(...v.tenure))} height={110} />
            </div>
            <div className="card m-chart m-bars">
              <b>Women by department</b>
              <small>{v.femalePct}% in this view</small>
              <BarList rows={v.deptRows.map((d) => ({ label: d.name, value: d.femalePct }))} />
            </div>
          </>
        )}

        {tab === "Retention" && (
          <>
            <div className="card m-chart m-bars">
              <b>Attrition by department</b>
              <small>Annualised</small>
              <BarList rows={v.deptRows.map((d) => ({ label: d.name, value: d.attrition }))} />
            </div>
            <div className="card m-chart m-bars">
              <b>What drives flight risk</b>
              <small>{v.flightRisk} people show two or more signals</small>
              <BarList rows={riskDrivers} alt />
            </div>
          </>
        )}

        {tab === "Learning" && (
          <>
            <div className="card m-chart m-bars">
              <b>Compliance by module</b>
              <small>Mandatory learning · {v.training}% overall</small>
              <BarList rows={MODULES.map((m, i) => ({ label: m, value: v.modules[i] }))} />
            </div>
            <div className="list" style={{ marginTop: 10 }}>
              {siteOverdue
                .filter((s) => zone === "all" || s.zone === zone)
                .map((s) => (
                  <div key={s.site} className="list-item">
                    <Icon name="school" />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: 15 }}>{s.site}</h4>
                      <div className="tiny">
                        {s.zone} · mostly {s.module}
                      </div>
                    </div>
                    <b style={{ fontSize: 17 }}>{s.overdue}</b>
                  </div>
                ))}
            </div>
          </>
        )}

        {tab === "Hiring" && (
          <>
            <div className="m-kpis">
              <MKpi label="Offer acceptance" value={`${v.offerAccept}%`} sub="Of offers made" />
              <MKpi label="Internal fill" value={`${v.internalFill}%`} sub="Through the IJP" />
            </div>
            <div className="card m-chart">
              <b>Hiring funnel</b>
              <small>Current open requisitions</small>
              <Funnel steps={v.funnel} />
            </div>
          </>
        )}
      </div>
    </MobileRequireHR>
  );
}

export function MobileHeat() {
  const nav = useNavigate();
  const [channel, setChannel] = useState<HeatChannel | "All">("All");
  const [open, setOpen] = useState<string | null>(null);
  const list = useMemo(() => rankedHeat(channel), [channel]);
  const totals = heatTotals();
  const attention = rankedHeat().filter(needsAttention);
  const matrix = topicZoneMatrix();

  return (
    <MobileRequireHR title="Engagement heat">
      <ScreenHeader title="Engagement heat" />
      <div className="scroll">
        <div className="between" style={{ alignItems: "baseline" }}>
          <h1 className="h1" style={{ fontSize: 24, margin: 0 }}>What’s heating up</h1>
          <span className="tag high">Illustrative</span>
        </div>
        <p className="tiny" style={{ margin: "4px 0 12px" }}>
          Posts and discussions gathering momentum — peer threads surfaced from Viva Engage.
        </p>

        <div className="m-kpis">
          <MKpi label="Heating up" value={String(totals.heating)} sub="Up 20%+ in 24h" />
          <MKpi label="Need a response" value={String(totals.attention)} sub="Rising and negative" />
        </div>

        {attention.length > 0 && (
          <button className="heat-alert m" onClick={() => setOpen(attention[0].id)}>
            <Icon name="local_fire_department" size={19} />
            <div>
              <b>
                {attention.length} need{attention.length > 1 ? "" : "s"} a response
              </b>
              <span>{attention[0].title}</span>
            </div>
          </button>
        )}

        <div className="filters" style={{ marginTop: 12 }}>
          {HEAT_CHANNELS.map((c) => (
            <button key={c} className={channel === c ? "filter on" : "filter"} onClick={() => setChannel(c)}>
              {c}
            </button>
          ))}
        </div>

        <div className="list">
          {list.map((i, idx) => (
            <div key={i.id} className="m-heat">
              <button
                className="m-heat-row"
                data-hint={idx === 0 ? "m-heat-list" : undefined}
                onClick={() => setOpen(open === i.id ? null : i.id)}
              >
                <span className="heat-rank">{idx + 1}</span>
                <span style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                  <span className="ann-meta">
                    <span className={`tag ${i.state === "Heating up" ? "crit" : i.state === "Cooling" ? "" : "high"}`}>
                      {i.state === "Heating up" ? "🔥 Heating" : i.state}
                    </span>
                    <span className="tag">{i.topic}</span>
                  </span>
                  <b>{i.title}</b>
                  <small>{i.channel}</small>
                </span>
                <span className="m-heat-score">
                  <Sparkline data={i.series} w={54} h={20} color={i.state === "Cooling" ? "#8b8b94" : "#f40009"} />
                  <b>{i.heat}</b>
                </span>
              </button>
              {open === i.id && (
                <div className="m-heat-detail">
                  <div className="heat-stats">
                    <div>
                      <b>{i.views.toLocaleString("en-IN")}</b>
                      <small>Views</small>
                    </div>
                    <div>
                      <b>{i.reactions.toLocaleString("en-IN")}</b>
                      <small>{i.channel === "Poll" ? "Votes" : "Reacts"}</small>
                    </div>
                    <div>
                      <b>{i.comments}</b>
                      <small>Comments</small>
                    </div>
                    <div>
                      <b>{i.velocity >= 0 ? "+" : ""}{i.velocity}%</b>
                      <small>24h</small>
                    </div>
                  </div>
                  <small className="tiny" style={{ display: "block", margin: "10px 0 5px" }}>Sentiment</small>
                  <SentimentBar {...i.sentiment} />
                  <div className="heat-action">
                    <Icon name="lightbulb" size={17} />
                    <div>
                      <small>Recommended action</small>
                      <b>{i.action}</b>
                    </div>
                  </div>
                  <button className="cta small" style={{ marginTop: 10, width: "100%" }} onClick={() => nav(i.to)}>
                    Open the conversation
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="section-title">
          <h3>Topic heat by zone</h3>
        </div>
        <div className="card" style={{ padding: 10 }}>
          <table className="m-grid">
            <thead>
              <tr>
                <th />
                {matrix.zones.map((z) => (
                  <th key={z}>{z}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrix.rows.map((r) => (
                <tr key={r.topic}>
                  <td className="t">{r.topic}</td>
                  {r.values.map((val, k) => (
                    <td key={k} style={{ background: heatColor(val), color: val > 55 ? "#fff" : "#111114" }}>
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MobileRequireHR>
  );
}
