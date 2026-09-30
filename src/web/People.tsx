import { useMemo, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "../ui";
import { useHub } from "../store";
import { isHR } from "../personas";
import {
  departments,
  deptName,
  GENERATIONS,
  MODULES,
  peopleInsights,
  peopleView,
  RATING_BANDS,
  riskDrivers,
  siteOverdue,
  TENURE_BANDS,
  ZONES,
  type DeptId,
  type Period,
  type ZoneId,
} from "../hr";
import {
  HEAT_CHANNELS,
  heatTotals,
  needsAttention,
  rankedHeat,
  topicZoneMatrix,
  type HeatChannel,
} from "../heat";
import {
  BarList,
  ColumnPair,
  Columns,
  Delta,
  Funnel,
  heatColor,
  scoreColor,
  SentimentBar,
  Sparkline,
  StackBar,
  TrendLine,
} from "./charts";

/** Full analytics is HR-only. Everyone else gets a clear, non-broken dead end. */
export function RequireHR({ children }: { children: ReactNode }) {
  const { user } = useHub();
  const nav = useNavigate();
  if (isHR(user)) return <>{children}</>;
  return (
    <div className="wa-card" style={{ maxWidth: 560, margin: "40px auto", textAlign: "center", padding: 32 }}>
      <span className="ico" style={{ display: "inline-grid", placeItems: "center", width: 48, height: 48, borderRadius: 14, background: "rgba(244,0,9,0.08)", color: "var(--brand)" }}>
        <Icon name="lock" size={24} />
      </span>
      <h3 style={{ fontSize: 19, margin: "14px 0 6px" }}>Analytics is restricted to HR</h3>
      <p className="wa-sub" style={{ lineHeight: 1.5, marginBottom: 18 }}>
        People analytics, engagement heat and communications reach are available to the HR analytics
        team. Your own leave, training and requests are in My Workspace.
      </p>
      <button className="wa-cta" onClick={() => nav("/workspace")}>
        Open My Workspace
      </button>
    </div>
  );
}

const TABS = ["Overview", "Workforce", "Attrition & retention", "Learning & compliance", "Hiring", "Attendance & performance"] as const;
type Tab = (typeof TABS)[number];

function Kpi({ label, value, sub, delta, hint }: { label: string; value: string; sub: string; delta?: number; hint?: string }) {
  return (
    <div className="wa-card wa-kpi" data-hint={hint}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
        <span className="l">{label}</span>
        {delta !== undefined && delta !== 0 && <Delta value={delta} />}
      </div>
      <span className="v">{value}</span>
      <span className="s">{sub}</span>
    </div>
  );
}

export function WebPeopleAnalytics() {
  const [dept, setDept] = useState<DeptId | "all">("all");
  const [zone, setZone] = useState<ZoneId | "all">("all");
  const [period, setPeriod] = useState<Period>("12M");
  const [tab, setTab] = useState<Tab>("Overview");

  const v = useMemo(() => peopleView({ dept, zone, period }), [dept, zone, period]);
  const insights = useMemo(() => peopleInsights(v), [v]);
  const scope = `${deptName(dept)} · ${zone === "all" ? "All zones" : `${zone} zone`} · last ${v.months} months`;

  return (
    <RequireHR>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
        <h1 className="wa-h1" style={{ margin: 0 }}>People analytics</h1>
        <span className="tag high">Illustrative data</span>
      </div>
      <p className="wa-lede" style={{ marginTop: 6 }}>
        Headcount, attrition, learning, hiring and attendance for {v.headcount.toLocaleString("en-IN")} employees —
        cut by department, zone and period.
      </p>

      {/* ---------- filters ---------- */}
      <div className="pa-filters" data-hint="hr-filters">
        <select className="wa-lang" value={dept} onChange={(e) => setDept(e.target.value as DeptId | "all")} aria-label="Department">
          <option value="all">All departments</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
        <div className="wa-pill-row" style={{ margin: 0 }}>
          {(["all", ...ZONES] as const).map((z) => (
            <button key={z} className={zone === z ? "wa-pill on" : "wa-pill"} onClick={() => setZone(z)}>
              {z === "all" ? "All zones" : z}
            </button>
          ))}
        </div>
        <div className="wa-pill-row" style={{ margin: 0 }}>
          {(["3M", "6M", "12M"] as Period[]).map((p) => (
            <button key={p} className={period === p ? "wa-pill on" : "wa-pill"} onClick={() => setPeriod(p)}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* ---------- KPIs ---------- */}
      <div className="wa-grid pa-kpis">
        <Kpi hint="hr-kpi" label="Headcount" value={v.headcount.toLocaleString("en-IN")} sub={`${v.netChange >= 0 ? "+" : ""}${v.netChange} net · ${v.joiners} in, ${v.leavers} out`} />
        <Kpi label="Attrition (annualised)" value={`${v.attrition}%`} sub={`${v.voluntary}% voluntary · ${v.regretted}% regretted`} delta={period === "12M" ? undefined : -v.attritionDelta} />
        <Kpi label="Training compliance" value={`${v.training}%`} sub={`${v.overdue.toLocaleString("en-IN")} people overdue`} />
        <Kpi label="eNPS" value={v.eNPS > 0 ? `+${v.eNPS}` : `${v.eNPS}`} sub={`Pulse ${v.pulse} / 5`} />
        <Kpi label="Absenteeism" value={`${v.absenteeism}%`} sub={`${v.overtime} h overtime / head / month`} />
        <Kpi label="Open roles" value={String(v.openRoles)} sub={`${v.timeToFill} days to fill · ${v.internalFill}% internal`} />
      </div>

      {/* ---------- tabs ---------- */}
      <div className="pa-tabs" data-hint="hr-tabs">
        {TABS.map((t) => (
          <button key={t} className={tab === t ? "on" : ""} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </div>
      <p className="wa-sub" style={{ margin: "0 2px 14px" }}>{scope}</p>

      {tab === "Overview" && (
        <>
          <div className="wa-split">
            <div className="wa-card" data-hint="hr-movement">
              <h3>Headcount movement</h3>
              <p className="wa-sub" style={{ marginBottom: 14 }}>Joiners against leavers, month by month</p>
              <ColumnPair labels={v.labels} a={v.joinersSeries} b={v.leaversSeries} />
            </div>
            <div className="wa-card">
              <h3>What this is telling you</h3>
              <p className="wa-sub" style={{ marginBottom: 4 }}>Re-generated for the current filter</p>
              {insights.map((i) => (
                <div key={i.title} className={`wa-insight ${i.tone}`}>
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
          <div className="wa-card" style={{ marginTop: 16 }} data-hint="hr-attr-trend">
            <h3>Attrition trend</h3>
            <p className="wa-sub" style={{ marginBottom: 8 }}>Monthly exits, annualised · dashed line is the 12% target</p>
            <TrendLine labels={v.labels} data={v.attritionTrend} target={12} />
          </div>
          <DeptTable v={v} />
        </>
      )}

      {tab === "Workforce" && (
        <>
          <div className="wa-grid wa-g2">
            <div className="wa-card" data-hint="hr-generations">
              <h3>Generations</h3>
              <p className="wa-sub" style={{ marginBottom: 16 }}>Average age {v.avgAge} · designs for the youngest cohort first</p>
              <StackBar
                parts={GENERATIONS.map((g, i) => ({
                  label: g,
                  value: v.generations[i],
                  color: ["#f40009", "#0f172a", "#d97706"][i],
                }))}
              />
            </div>
            <div className="wa-card">
              <h3>Tenure</h3>
              <p className="wa-sub" style={{ marginBottom: 10 }}>Average {v.avgTenure} years</p>
              <Columns labels={TENURE_BANDS} values={v.tenure} highlight={v.tenure.indexOf(Math.max(...v.tenure))} />
            </div>
          </div>
          <div className="wa-card" style={{ marginTop: 16 }}>
            <h3>Gender diversity by department</h3>
            <p className="wa-sub" style={{ marginBottom: 14 }}>{v.femalePct}% women in this view</p>
            {v.deptRows.map((d) => (
              <div key={d.id} className="pa-row">
                <span className="pa-row-l">{d.name}</span>
                <div style={{ flex: 1 }}>
                  <div className="sb">
                    <span style={{ width: `${d.femalePct}%`, background: "#f40009" }} />
                    <span style={{ width: `${100 - d.femalePct}%`, background: "#0f172a" }} />
                  </div>
                </div>
                <b className="pa-row-v">{d.femalePct}%</b>
              </div>
            ))}
            <div className="sb-legend" style={{ marginTop: 10 }}>
              <span>
                <i style={{ background: "#f40009" }} /> Women
              </span>
              <span>
                <i style={{ background: "#0f172a" }} /> Men
              </span>
            </div>
          </div>
          <ZoneTable v={v} />
        </>
      )}

      {tab === "Attrition & retention" && (
        <>
          <div className="wa-grid wa-g3">
            <Kpi label="Voluntary share" value={`${v.voluntary}%`} sub="Of all exits in the window" />
            <Kpi label="Regretted exits" value={`${v.regretted}%`} sub="Rated 4 or 5 in their last cycle" />
            <Kpi label="High flight risk" value={String(v.flightRisk)} sub="Two or more risk signals today" />
          </div>
          <div className="wa-split" style={{ marginTop: 16 }}>
            <div className="wa-card">
              <h3>Attrition by department</h3>
              <p className="wa-sub" style={{ marginBottom: 14 }}>Annualised for the window</p>
              <BarList rows={v.deptRows.map((d) => ({ label: d.name, value: d.attrition }))} />
            </div>
            <div className="wa-card" data-hint="hr-risk">
              <h3>What drives flight risk</h3>
              <p className="wa-sub" style={{ marginBottom: 14 }}>Share of high-risk employees showing each signal</p>
              <BarList rows={riskDrivers} alt />
            </div>
          </div>
          <div className="wa-card" style={{ marginTop: 16 }}>
            <h3>Attrition trend</h3>
            <TrendLine labels={v.labels} data={v.attritionTrend} target={12} />
          </div>
        </>
      )}

      {tab === "Learning & compliance" && (
        <>
          <div className="wa-grid wa-g3">
            <Kpi label="Mandatory compliance" value={`${v.training}%`} sub={`${v.overdue.toLocaleString("en-IN")} people overdue`} />
            <Kpi label="Lowest module" value={`${Math.min(...v.modules)}%`} sub={MODULES[v.modules.indexOf(Math.min(...v.modules))]} />
            <Kpi label="Highest module" value={`${Math.max(...v.modules)}%`} sub={MODULES[v.modules.indexOf(Math.max(...v.modules))]} />
          </div>
          <div className="wa-card" style={{ marginTop: 16 }} data-hint="hr-modules">
            <h3>Compliance by module and department</h3>
            <p className="wa-sub" style={{ marginBottom: 12 }}>Green at 92%+ · amber · red at 75% and below</p>
            <div style={{ overflowX: "auto" }}>
              <table className="wa-table pa-matrix">
                <thead>
                  <tr>
                    <th>Department</th>
                    {MODULES.map((m) => (
                      <th key={m}>{m}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {departments.map((d) => {
                    const zoneShift = zone === "all" ? 0 : { South: 3, West: 1, North: -2, East: -7 }[zone];
                    return (
                      <tr key={d.id} style={dept !== "all" && dept !== d.id ? { opacity: 0.4 } : undefined}>
                        <td className="t">{d.name}</td>
                        {d.modules.map((m, i) => {
                          const val = Math.max(0, Math.min(100, m + zoneShift));
                          return (
                            <td key={i} className="n" style={{ background: scoreColor(val), textAlign: "center" }}>
                              {val}%
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div className="wa-card" style={{ marginTop: 16 }}>
            <h3>Where the backlog sits</h3>
            <p className="wa-sub" style={{ marginBottom: 8 }}>Mandatory modules overdue, by site</p>
            <div className="wa-list">
              {siteOverdue
                .filter((s) => zone === "all" || s.zone === zone)
                .map((s) => (
                  <div key={s.site} className="wa-row" style={{ cursor: "default" }}>
                    <span className="ico" style={{ background: "rgba(244,0,9,0.08)", color: "var(--brand)" }}>
                      <Icon name="school" size={17} />
                    </span>
                    <span className="body">
                      <h4>{s.site}</h4>
                      <small>
                        {s.zone} · mostly {s.module}
                      </small>
                    </span>
                    <b style={{ fontSize: 18, letterSpacing: "-0.02em" }}>{s.overdue}</b>
                  </div>
                ))}
              {siteOverdue.filter((s) => zone === "all" || s.zone === zone).length === 0 && (
                <div className="wa-empty">No sites with a material backlog in this zone.</div>
              )}
            </div>
          </div>
        </>
      )}

      {tab === "Hiring" && (
        <>
          <div className="wa-grid wa-g4">
            <Kpi label="Open roles" value={String(v.openRoles)} sub="Approved and live" />
            <Kpi label="Time to fill" value={`${v.timeToFill} d`} sub="Requisition to accepted offer" />
            <Kpi label="Offer acceptance" value={`${v.offerAccept}%`} sub="Of offers made" />
            <Kpi label="Internal fill" value={`${v.internalFill}%`} sub="Filled through the IJP" />
          </div>
          <div className="wa-card" style={{ marginTop: 16 }}>
            <h3>Hiring funnel</h3>
            <p className="wa-sub" style={{ marginBottom: 14 }}>Current open requisitions</p>
            <Funnel steps={v.funnel} />
          </div>
          <div className="wa-card" style={{ marginTop: 16 }}>
            <h3>Open roles by department</h3>
            <BarList rows={v.deptRows.map((d) => ({ label: d.name, value: d.openRoles }))} suffix="" />
          </div>
        </>
      )}

      {tab === "Attendance & performance" && (
        <>
          <div className="wa-grid wa-g2">
            <div className="wa-card">
              <h3>Absenteeism by zone</h3>
              <p className="wa-sub" style={{ marginBottom: 14 }}>Unplanned absence, share of scheduled days</p>
              <BarList rows={v.zoneRows.map((z) => ({ label: z.zone, value: z.absenteeism }))} />
            </div>
            <div className="wa-card">
              <h3>Leave utilisation</h3>
              <p className="wa-sub" style={{ marginBottom: 14 }}>Share of annual entitlement used</p>
              <BarList
                rows={[
                  { label: "Casual leave", value: v.leaveUse.casual },
                  { label: "Earned leave", value: v.leaveUse.earned },
                  { label: "Sick leave", value: v.leaveUse.sick },
                ]}
                alt
              />
            </div>
          </div>
          <div className="wa-grid wa-g2" style={{ marginTop: 16 }}>
            <div className="wa-card">
              <h3>Performance ratings</h3>
              <p className="wa-sub" style={{ marginBottom: 10 }}>Last appraisal cycle · 1 low, 5 high</p>
              <Columns labels={RATING_BANDS} values={v.ratings} highlight={2} />
            </div>
            <div className="wa-card">
              <h3>eNPS by department</h3>
              <p className="wa-sub" style={{ marginBottom: 14 }}>Promoters minus detractors</p>
              <BarList rows={v.deptRows.map((d) => ({ label: d.name, value: Math.max(0, d.eNPS) }))} suffix="" />
            </div>
          </div>
        </>
      )}
    </RequireHR>
  );
}

function DeptTable({ v }: { v: ReturnType<typeof peopleView> }) {
  return (
    <div className="wa-card" style={{ marginTop: 16 }} data-hint="hr-dept-table">
      <h3>Departments at a glance</h3>
      <p className="wa-sub" style={{ marginBottom: 12 }}>Cells are coloured against target</p>
      <table className="wa-table">
        <thead>
          <tr>
            <th>Department</th>
            <th>Headcount</th>
            <th>Attrition</th>
            <th>Training</th>
            <th>eNPS</th>
            <th>Absenteeism</th>
            <th>Flight risk</th>
          </tr>
        </thead>
        <tbody>
          {v.deptRows.map((d) => (
            <tr key={d.id} style={v.filter.dept !== "all" && v.filter.dept !== d.id ? { opacity: 0.45 } : undefined}>
              <td className="t">
                {d.name}
                <br />
                <small className="wa-sub">{d.owner}</small>
              </td>
              <td className="n">{d.headcount.toLocaleString("en-IN")}</td>
              <td className="n" style={{ background: d.attrition > 14 ? "rgba(244,0,9,0.12)" : d.attrition > 12 ? "rgba(255,159,10,0.16)" : "rgba(52,199,89,0.14)" }}>
                {d.attrition}%
              </td>
              <td className="n" style={{ background: scoreColor(d.training) }}>{d.training}%</td>
              <td className="n">{d.eNPS > 0 ? `+${d.eNPS}` : d.eNPS}</td>
              <td className="n">{d.absenteeism}%</td>
              <td className="n">{d.flightRisk}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ZoneTable({ v }: { v: ReturnType<typeof peopleView> }) {
  return (
    <div className="wa-card" style={{ marginTop: 16 }}>
      <h3>Zones</h3>
      <p className="wa-sub" style={{ marginBottom: 12 }}>{deptName(v.filter.dept)}</p>
      <table className="wa-table">
        <thead>
          <tr>
            <th>Zone</th>
            <th>Headcount</th>
            <th>Attrition</th>
            <th>Training</th>
            <th>eNPS</th>
            <th>Absenteeism</th>
          </tr>
        </thead>
        <tbody>
          {v.zoneRows.map((z) => (
            <tr key={z.zone} style={v.filter.zone !== "all" && v.filter.zone !== z.zone ? { opacity: 0.45 } : undefined}>
              <td className="t">{z.zone}</td>
              <td className="n">{z.headcount.toLocaleString("en-IN")}</td>
              <td className="n">{z.attrition}%</td>
              <td className="n" style={{ background: scoreColor(z.training) }}>{z.training}%</td>
              <td className="n">{z.eNPS > 0 ? `+${z.eNPS}` : z.eNPS}</td>
              <td className="n">{z.absenteeism}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ================================================================== *
 * Engagement heat
 * ================================================================== */

type Sort = "heat" | "momentum" | "negative";

export function WebEngagementHeat() {
  const nav = useNavigate();
  const [channel, setChannel] = useState<HeatChannel | "All">("All");
  const [sort, setSort] = useState<Sort>("heat");
  const list = useMemo(() => {
    const r = rankedHeat(channel);
    if (sort === "momentum") return [...r].sort((a, b) => b.velocity - a.velocity);
    if (sort === "negative") return [...r].sort((a, b) => b.sentiment.neg - a.sentiment.neg);
    return r;
  }, [channel, sort]);
  const [selId, setSelId] = useState<string | null>(null);
  const sel = list.find((i) => i.id === selId) ?? list[0];
  const totals = heatTotals();
  const matrix = topicZoneMatrix();
  const attention = rankedHeat().filter(needsAttention);

  return (
    <RequireHR>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
        <h1 className="wa-h1" style={{ margin: 0 }}>Engagement heat</h1>
        <span className="tag high">Illustrative data</span>
      </div>
      <p className="wa-lede" style={{ marginTop: 6 }}>
        Which posts and discussions are gathering momentum right now — so HR and Communications
        can put their effort where the conversation already is. Peer threads are surfaced from Viva Engage.
      </p>

      <div className="wa-grid wa-g4">
        <div className="wa-card wa-kpi" data-hint="heat-kpi">
          <span className="l">Heating up</span>
          <span className="v" style={{ color: "var(--brand)" }}>{totals.heating}</span>
          <span className="s">Momentum up 20%+ in 24 hours</span>
        </div>
        <div className="wa-card wa-kpi">
          <span className="l">Needs a response</span>
          <span className="v">{totals.attention}</span>
          <span className="s">Rising, with 30%+ negative sentiment</span>
        </div>
        <div className="wa-card wa-kpi">
          <span className="l">Comments this week</span>
          <span className="v">{totals.conversations.toLocaleString("en-IN")}</span>
          <span className="s">Across {rankedHeat().length} tracked items</span>
        </div>
        <div className="wa-card wa-kpi">
          <span className="l">Reactions this week</span>
          <span className="v">{totals.reactions.toLocaleString("en-IN")}</span>
          <span className="s">Including poll votes</span>
        </div>
      </div>

      {attention.length > 0 && (
        <div className="heat-alert" data-hint="heat-attention">
          <Icon name="local_fire_department" size={20} />
          <div>
            <b>
              {attention.length} conversation{attention.length > 1 ? "s" : ""} need{attention.length > 1 ? "" : "s"} a response
            </b>
            <span>{attention.map((a) => a.title).join(" · ")}</span>
          </div>
          <button className="wa-cta sm" onClick={() => setSelId(attention[0].id)}>
            Review
          </button>
        </div>
      )}

      <div className="pa-filters" style={{ marginTop: 18 }}>
        <div className="wa-pill-row" style={{ margin: 0 }} data-hint="heat-channels">
          {HEAT_CHANNELS.map((c) => (
            <button key={c} className={channel === c ? "wa-pill on" : "wa-pill"} onClick={() => { setChannel(c); setSelId(null); }}>
              {c}
            </button>
          ))}
        </div>
        <select className="wa-lang" value={sort} onChange={(e) => setSort(e.target.value as Sort)} aria-label="Sort">
          <option value="heat">Sort by heat</option>
          <option value="momentum">Sort by momentum</option>
          <option value="negative">Sort by negative sentiment</option>
        </select>
      </div>

      <div className="wa-split" style={{ marginTop: 14 }}>
        <div className="wa-card" style={{ padding: "6px 16px" }} data-hint="heat-list">
          {list.map((i, idx) => (
            <button key={i.id} className={sel && sel.id === i.id ? "heat-row on" : "heat-row"} onClick={() => setSelId(i.id)}>
              <span className="heat-rank">{idx + 1}</span>
              <span className="heat-body">
                <span className="ann-meta">
                  <span className={`tag ${i.state === "Heating up" ? "crit" : i.state === "Cooling" ? "" : "high"}`}>
                    {i.state === "Heating up" ? "🔥 Heating up" : i.state}
                  </span>
                  <span className="tag">{i.channel}</span>
                  <span className="tag">{i.topic}</span>
                  {needsAttention(i) && <span className="tag dark">Needs a response</span>}
                </span>
                <b>{i.title}</b>
                <small>
                  {i.source} · {i.posted}
                </small>
              </span>
              <span className="heat-metrics">
                <Sparkline data={i.series} color={i.state === "Cooling" ? "#8b8b94" : "#f40009"} />
                <span className="heat-score">
                  <b>{i.heat}</b>
                  <small className={i.velocity >= 0 ? "tk-up" : "tk-down"}>
                    {i.velocity >= 0 ? "▲" : "▼"} {Math.abs(i.velocity)}%
                  </small>
                </span>
              </span>
            </button>
          ))}
        </div>

        {sel && (
          <div className="wa-card heat-detail" data-hint="heat-detail">
            <div className="ann-meta">
              <span className="tag">{sel.channel}</span>
              <span className="tag">{sel.topic}</span>
            </div>
            <h3 style={{ fontSize: 17, margin: "10px 0 4px", lineHeight: 1.28 }}>{sel.title}</h3>
            <p className="wa-sub">
              {sel.source} · strongest in {sel.topFunction}
            </p>
            <div className="heat-stats">
              <div>
                <b>{sel.views.toLocaleString("en-IN")}</b>
                <small>Views</small>
              </div>
              <div>
                <b>{sel.reactions.toLocaleString("en-IN")}</b>
                <small>{sel.channel === "Poll" ? "Votes" : "Reactions"}</small>
              </div>
              <div>
                <b>{sel.comments}</b>
                <small>Comments</small>
              </div>
              <div>
                <b>{sel.shares}</b>
                <small>Shares</small>
              </div>
            </div>
            <p className="wa-sub" style={{ margin: "14px 0 6px", fontWeight: 600 }}>Engagement, last 7 days</p>
            <TrendLine labels={["D-6", "D-5", "D-4", "D-3", "D-2", "D-1", "Today"]} data={sel.series} suffix="" height={120} />
            <p className="wa-sub" style={{ margin: "12px 0 6px", fontWeight: 600 }}>Sentiment</p>
            <SentimentBar {...sel.sentiment} />
            <div className="sb-legend" style={{ marginTop: 8 }}>
              <span>
                <i style={{ background: "#34c759" }} /> Positive <b>{sel.sentiment.pos}%</b>
              </span>
              <span>
                <i style={{ background: "#c7c7cc" }} /> Neutral <b>{sel.sentiment.neu}%</b>
              </span>
              <span>
                <i style={{ background: "#f40009" }} /> Negative <b>{sel.sentiment.neg}%</b>
              </span>
            </div>
            <p className="wa-sub" style={{ margin: "14px 0 8px", fontWeight: 600 }}>Where it is coming from</p>
            <BarList rows={ZONES.map((z) => ({ label: z, value: sel.zones[z] }))} />
            <div className="heat-action">
              <Icon name="lightbulb" size={18} />
              <div>
                <small>Recommended action</small>
                <b>{sel.action}</b>
              </div>
            </div>
            <button className="wa-cta" style={{ width: "100%", justifyContent: "center", marginTop: 12 }} onClick={() => nav(sel.to)}>
              Open the conversation <Icon name="arrow_forward" size={16} />
            </button>
          </div>
        )}
      </div>

      <div className="wa-card" style={{ marginTop: 16 }} data-hint="heat-matrix">
        <h3>Topic heat by zone</h3>
        <p className="wa-sub" style={{ marginBottom: 12 }}>Darker means more engagement and momentum</p>
        <div style={{ overflowX: "auto" }}>
          <table className="wa-table heat-grid">
            <thead>
              <tr>
                <th>Topic</th>
                {matrix.zones.map((z) => (
                  <th key={z}>{z}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrix.rows.map((r) => (
                <tr key={r.topic}>
                  <td className="t">{r.topic}</td>
                  {r.values.map((val, i) => (
                    <td key={i} style={{ background: heatColor(val), color: val > 55 ? "#fff" : "#111114", textAlign: "center" }} className="n">
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </RequireHR>
  );
}
