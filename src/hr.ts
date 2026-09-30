/**
 * People analytics — the HRMS-style workforce model behind the HR dashboards.
 *
 * Each department carries its own base metrics and twelve months of joiner /
 * leaver history; zone and period filters are applied on top, so every chart
 * on the dashboard is computed rather than hard-coded. All figures are
 * illustrative demo data sized to HCCB's published 5,000+ headcount.
 */

export type DeptId = "mfg" | "com" | "sc" | "ef";
export type ZoneId = "South" | "West" | "North" | "East";
export type Period = "3M" | "6M" | "12M";
export type PeopleFilter = { dept: DeptId | "all"; zone: ZoneId | "all"; period: Period };

export const MONTHS = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];
export const ZONES: ZoneId[] = ["South", "West", "North", "East"];
export const GENERATIONS = ["Gen Z", "Millennials", "Gen X"] as const;
export const TENURE_BANDS = ["< 1 yr", "1–3", "3–5", "5–10", "10+"] as const;
export const RATING_BANDS = ["1", "2", "3", "4", "5"] as const;
export const MODULES = [
  "Code of Conduct",
  "POSH",
  "EHS & plant safety",
  "Data privacy (DPDP)",
  "Defensive driving",
] as const;

type DeptBase = {
  id: DeptId;
  name: string;
  owner: string;
  headcount: number;
  zoneShare: Record<ZoneId, number>;
  femalePct: number;
  avgAge: number;
  avgTenure: number;
  voluntaryShare: number;
  regrettedShare: number;
  absenteeism: number;
  overtimeHrs: number;
  training: number;
  modules: number[];
  openRoles: number;
  timeToFill: number;
  offerAccept: number;
  internalFill: number;
  eNPS: number;
  pulse: number;
  generations: number[];
  tenure: number[];
  ratings: number[];
  flightRisk: number;
  leaveUse: { casual: number; earned: number; sick: number };
  joiners: number[];
  leavers: number[];
};

export const departments: DeptBase[] = [
  {
    id: "mfg",
    name: "Manufacturing",
    owner: "Operations",
    headcount: 2310,
    zoneShare: { South: 0.34, West: 0.26, North: 0.22, East: 0.18 },
    femalePct: 11,
    avgAge: 36.4,
    avgTenure: 7.8,
    voluntaryShare: 0.68,
    regrettedShare: 0.21,
    absenteeism: 4.6,
    overtimeHrs: 11.2,
    training: 84,
    modules: [96, 91, 88, 71, 64],
    openRoles: 38,
    timeToFill: 34,
    offerAccept: 81,
    internalFill: 22,
    eNPS: 18,
    pulse: 3.7,
    generations: [0.31, 0.52, 0.17],
    tenure: [0.09, 0.18, 0.16, 0.27, 0.3],
    ratings: [0.03, 0.12, 0.58, 0.21, 0.06],
    flightRisk: 96,
    leaveUse: { casual: 71, earned: 54, sick: 38 },
    joiners: [24, 21, 19, 23, 27, 22, 20, 18, 26, 28, 23, 25],
    leavers: [19, 22, 24, 20, 18, 21, 23, 25, 22, 20, 24, 26],
  },
  {
    id: "com",
    name: "Commercial",
    owner: "Sales Excellence",
    headcount: 1420,
    zoneShare: { South: 0.3, West: 0.28, North: 0.24, East: 0.18 },
    femalePct: 16,
    avgAge: 31.8,
    avgTenure: 4.1,
    voluntaryShare: 0.81,
    regrettedShare: 0.34,
    absenteeism: 3.1,
    overtimeHrs: 6.4,
    training: 88,
    modules: [95, 89, 76, 82, 79],
    openRoles: 52,
    timeToFill: 29,
    offerAccept: 74,
    internalFill: 31,
    eNPS: 12,
    pulse: 3.5,
    generations: [0.46, 0.46, 0.08],
    tenure: [0.17, 0.31, 0.21, 0.19, 0.12],
    ratings: [0.04, 0.14, 0.54, 0.22, 0.06],
    flightRisk: 118,
    leaveUse: { casual: 68, earned: 49, sick: 29 },
    joiners: [18, 17, 16, 20, 19, 18, 17, 15, 22, 20, 19, 18],
    leavers: [15, 16, 18, 17, 19, 16, 18, 20, 19, 17, 18, 21],
  },
  {
    id: "sc",
    name: "Supply chain",
    owner: "Integrated Supply Chain",
    headcount: 986,
    zoneShare: { South: 0.31, West: 0.27, North: 0.23, East: 0.19 },
    femalePct: 13,
    avgAge: 34.9,
    avgTenure: 6.2,
    voluntaryShare: 0.72,
    regrettedShare: 0.24,
    absenteeism: 3.9,
    overtimeHrs: 9.1,
    training: 86,
    modules: [94, 90, 85, 78, 83],
    openRoles: 21,
    timeToFill: 31,
    offerAccept: 79,
    internalFill: 27,
    eNPS: 16,
    pulse: 3.6,
    generations: [0.36, 0.5, 0.14],
    tenure: [0.12, 0.22, 0.18, 0.25, 0.23],
    ratings: [0.03, 0.13, 0.57, 0.21, 0.06],
    flightRisk: 41,
    leaveUse: { casual: 70, earned: 52, sick: 34 },
    joiners: [11, 10, 9, 12, 11, 10, 9, 8, 13, 12, 10, 11],
    leavers: [9, 10, 11, 9, 8, 10, 11, 12, 10, 9, 11, 12],
  },
  {
    id: "ef",
    name: "Enabling functions",
    owner: "HR · Finance · IT · Legal",
    headcount: 468,
    zoneShare: { South: 0.62, West: 0.14, North: 0.14, East: 0.1 },
    femalePct: 41,
    avgAge: 34.2,
    avgTenure: 5.6,
    voluntaryShare: 0.77,
    regrettedShare: 0.29,
    absenteeism: 2.2,
    overtimeHrs: 3.8,
    training: 95,
    modules: [99, 97, 92, 94, 90],
    openRoles: 14,
    timeToFill: 41,
    offerAccept: 86,
    internalFill: 38,
    eNPS: 29,
    pulse: 4.0,
    generations: [0.33, 0.55, 0.12],
    tenure: [0.14, 0.25, 0.2, 0.23, 0.18],
    ratings: [0.02, 0.1, 0.55, 0.25, 0.08],
    flightRisk: 17,
    leaveUse: { casual: 64, earned: 58, sick: 24 },
    joiners: [4, 3, 5, 4, 4, 3, 5, 4, 5, 4, 4, 5],
    leavers: [3, 4, 3, 4, 3, 3, 4, 5, 3, 4, 3, 4],
  },
];

/** How each zone shifts the national picture. East trails, South leads. */
const zoneAdj: Record<ZoneId, { attrition: number; training: number; eNPS: number; absenteeism: number; offer: number }> = {
  South: { attrition: 0.88, training: 3, eNPS: 5, absenteeism: -0.3, offer: 2 },
  West: { attrition: 0.97, training: 1, eNPS: 2, absenteeism: -0.1, offer: 0 },
  North: { attrition: 1.05, training: -2, eNPS: -3, absenteeism: 0.4, offer: -1 },
  East: { attrition: 1.22, training: -7, eNPS: -9, absenteeism: 1.1, offer: -5 },
};

const clampPct = (v: number) => Math.max(0, Math.min(100, v));
const round1 = (v: number) => Math.round(v * 10) / 10;
const periodMonths: Record<Period, number> = { "3M": 3, "6M": 6, "12M": 12 };

export type DeptRow = {
  id: DeptId;
  name: string;
  owner: string;
  headcount: number;
  attrition: number;
  training: number;
  eNPS: number;
  absenteeism: number;
  openRoles: number;
  flightRisk: number;
  femalePct: number;
};

/** One department, cut to a zone. */
function slice(d: DeptBase, zone: ZoneId | "all") {
  const zones = zone === "all" ? ZONES : [zone];
  const share = zones.reduce((s, z) => s + d.zoneShare[z], 0);
  const attritionMul =
    zone === "all" ? 1 : zoneAdj[zone].attrition;
  const adj =
    zone === "all"
      ? { training: 0, eNPS: 0, absenteeism: 0, offer: 0 }
      : zoneAdj[zone];
  return {
    d,
    share,
    headcount: Math.round(d.headcount * share),
    joiners: d.joiners.map((v) => v * share),
    leavers: d.leavers.map((v) => v * share * attritionMul),
    training: clampPct(d.training + adj.training),
    modules: d.modules.map((m) => clampPct(m + adj.training)),
    eNPS: d.eNPS + adj.eNPS,
    absenteeism: Math.max(0.5, d.absenteeism + adj.absenteeism),
    offerAccept: clampPct(d.offerAccept + adj.offer),
  };
}

function wavg(items: { w: number; v: number }[]) {
  const W = items.reduce((s, i) => s + i.w, 0) || 1;
  return items.reduce((s, i) => s + i.w * i.v, 0) / W;
}

function mixAvg(items: { w: number; v: number[] }[]) {
  const W = items.reduce((s, i) => s + i.w, 0) || 1;
  const n = items[0]?.v.length ?? 0;
  return Array.from({ length: n }, (_, k) => items.reduce((s, i) => s + i.w * i.v[k], 0) / W);
}

export type PeopleView = ReturnType<typeof peopleView>;

/** Everything the dashboard renders for a given filter. */
export function peopleView(f: PeopleFilter) {
  const months = periodMonths[f.period];
  const from = 12 - months;
  const depts = departments.filter((d) => f.dept === "all" || d.id === f.dept);
  const slices = depts.map((d) => slice(d, f.zone));

  const headcount = slices.reduce((s, x) => s + x.headcount, 0);
  const joinersSeries = MONTHS.map((_, i) => slices.reduce((s, x) => s + x.joiners[i], 0));
  const leaversSeries = MONTHS.map((_, i) => slices.reduce((s, x) => s + x.leavers[i], 0));
  const joiners = Math.round(joinersSeries.slice(from).reduce((a, b) => a + b, 0));
  const leavers = Math.round(leaversSeries.slice(from).reduce((a, b) => a + b, 0));

  // Annualised attrition for the window, and the monthly trend line.
  const attrition = round1((leavers / Math.max(1, headcount)) * (12 / months) * 100);
  const attritionTrend = leaversSeries.map((l) => round1((l / Math.max(1, headcount)) * 12 * 100));
  const prevLeavers = leaversSeries.slice(Math.max(0, from - months), from).reduce((a, b) => a + b, 0);
  const prevAttrition = from > 0 ? round1((prevLeavers / Math.max(1, headcount)) * (12 / months) * 100) : attrition;

  const w = (fn: (x: (typeof slices)[number]) => number) => slices.map((x) => ({ w: x.headcount, v: fn(x) }));

  const training = Math.round(wavg(w((x) => x.training)));
  const eNPS = Math.round(wavg(w((x) => x.eNPS)));
  const absenteeism = round1(wavg(w((x) => x.absenteeism)));
  const femalePct = Math.round(wavg(w((x) => x.d.femalePct)));
  const avgAge = round1(wavg(w((x) => x.d.avgAge)));
  const avgTenure = round1(wavg(w((x) => x.d.avgTenure)));
  const voluntary = Math.round(wavg(w((x) => x.d.voluntaryShare)) * 100);
  const regretted = Math.round(wavg(w((x) => x.d.regrettedShare)) * 100);
  const overtime = round1(wavg(w((x) => x.d.overtimeHrs)));
  const pulse = round1(wavg(w((x) => x.d.pulse)));
  const offerAccept = Math.round(wavg(w((x) => x.offerAccept)));
  const internalFill = Math.round(wavg(w((x) => x.d.internalFill)));
  const timeToFill = Math.round(wavg(w((x) => x.d.timeToFill)));
  const openRoles = Math.round(slices.reduce((s, x) => s + x.d.openRoles * x.share, 0));
  const flightRisk = Math.round(slices.reduce((s, x) => s + x.d.flightRisk * x.share * (f.zone === "East" ? 1.3 : 1), 0));

  const generations = mixAvg(slices.map((x) => ({ w: x.headcount, v: x.d.generations })));
  const tenure = mixAvg(slices.map((x) => ({ w: x.headcount, v: x.d.tenure })));
  const ratings = mixAvg(slices.map((x) => ({ w: x.headcount, v: x.d.ratings })));
  const modules = mixAvg(slices.map((x) => ({ w: x.headcount, v: x.modules })));
  const leaveUse = {
    casual: Math.round(wavg(w((x) => x.d.leaveUse.casual))),
    earned: Math.round(wavg(w((x) => x.d.leaveUse.earned))),
    sick: Math.round(wavg(w((x) => x.d.leaveUse.sick))),
  };

  // Department table always shows every department for the chosen zone.
  const deptRows: DeptRow[] = departments.map((d) => {
    const x = slice(d, f.zone);
    const l = x.leavers.slice(from).reduce((a, b) => a + b, 0);
    return {
      id: d.id,
      name: d.name,
      owner: d.owner,
      headcount: x.headcount,
      attrition: round1((l / Math.max(1, x.headcount)) * (12 / months) * 100),
      training: Math.round(x.training),
      eNPS: x.eNPS,
      absenteeism: round1(x.absenteeism),
      openRoles: Math.round(d.openRoles * x.share),
      flightRisk: Math.round(d.flightRisk * x.share),
      femalePct: d.femalePct,
    };
  });

  // Zone comparison for the selected department(s).
  const zoneRows = ZONES.map((z) => {
    const zs = depts.map((d) => slice(d, z));
    const hc = zs.reduce((s, x) => s + x.headcount, 0);
    const l = zs.reduce((s, x) => s + x.leavers.slice(from).reduce((a, b) => a + b, 0), 0);
    return {
      zone: z,
      headcount: hc,
      attrition: round1((l / Math.max(1, hc)) * (12 / months) * 100),
      training: Math.round(wavg(zs.map((x) => ({ w: x.headcount, v: x.training })))),
      eNPS: Math.round(wavg(zs.map((x) => ({ w: x.headcount, v: x.eNPS })))),
      absenteeism: round1(wavg(zs.map((x) => ({ w: x.headcount, v: x.absenteeism })))),
    };
  });

  // Hiring funnel scaled from open roles.
  const funnel = [
    { label: "Open roles", value: openRoles },
    { label: "Applicants", value: Math.round(openRoles * 30.9) },
    { label: "Shortlisted", value: Math.round(openRoles * 4.9) },
    { label: "Offered", value: Math.round(openRoles * 1.37) },
    { label: "Joined", value: Math.round(openRoles * 1.37 * (offerAccept / 100)) },
  ];

  const overdue = Math.round(headcount * (1 - training / 100));

  return {
    filter: f,
    months,
    labels: MONTHS.slice(from),
    headcount,
    netChange: joiners - leavers,
    joiners,
    leavers,
    joinersSeries: joinersSeries.slice(from).map(Math.round),
    leaversSeries: leaversSeries.slice(from).map(Math.round),
    attrition,
    attritionDelta: round1(attrition - prevAttrition),
    attritionTrend: attritionTrend.slice(from),
    voluntary,
    regretted,
    training,
    overdue,
    modules: modules.map(Math.round),
    eNPS,
    pulse,
    absenteeism,
    overtime,
    femalePct,
    avgAge,
    avgTenure,
    openRoles,
    timeToFill,
    offerAccept,
    internalFill,
    funnel,
    flightRisk,
    generations,
    tenure,
    ratings,
    leaveUse,
    deptRows,
    zoneRows,
  };
}

/** What drives predicted flight risk — share of high-risk employees showing each signal. */
export const riskDrivers = [
  { label: "No role change in 3+ years", value: 38 },
  { label: "Pay below band midpoint", value: 29 },
  { label: "Low pulse score two quarters running", value: 22 },
  { label: "Manager changed twice in 12 months", value: 17 },
  { label: "Commute over 90 minutes", value: 11 },
];

/** Mandatory-training backlog by site. */
export const siteOverdue = [
  { site: "Chittoor Plant", zone: "South" as ZoneId, overdue: 64, module: "Data privacy (DPDP)" },
  { site: "Guwahati Plant", zone: "East" as ZoneId, overdue: 58, module: "EHS & plant safety" },
  { site: "Siliguri Depot", zone: "East" as ZoneId, overdue: 47, module: "Defensive driving" },
  { site: "Hubballi Plant", zone: "South" as ZoneId, overdue: 41, module: "Data privacy (DPDP)" },
  { site: "Kolkata Sales Office", zone: "East" as ZoneId, overdue: 33, module: "Defensive driving" },
  { site: "Bengaluru Plant", zone: "South" as ZoneId, overdue: 22, module: "POSH" },
];

export function deptName(id: DeptId | "all") {
  return id === "all" ? "All departments" : departments.find((d) => d.id === id)?.name ?? id;
}

/** Plain-language read-outs generated from the current view. */
export function peopleInsights(v: PeopleView) {
  const out: { tone: "good" | "warn"; title: string; body: string }[] = [];
  const byAttrition = [...v.deptRows].sort((a, b) => b.attrition - a.attrition);
  const worstDept = byAttrition[0];
  const worstZone = [...v.zoneRows].sort((a, b) => a.training - b.training)[0];
  const bestZone = [...v.zoneRows].sort((a, b) => b.training - a.training)[0];

  if (v.filter.dept === "all") {
    out.push({
      tone: worstDept.attrition > 13 ? "warn" : "good",
      title: `${worstDept.name} carries the highest attrition at ${worstDept.attrition}%`,
      body: `${v.regretted}% of exits in this view were regretted. ${worstDept.flightRisk} people in ${worstDept.name} show two or more flight-risk signals.`,
    });
  } else {
    const me = v.deptRows.find((d) => d.id === v.filter.dept)!;
    const avg = v.deptRows.reduce((s, d) => s + d.attrition * d.headcount, 0) / Math.max(1, v.deptRows.reduce((s, d) => s + d.headcount, 0));
    const gap = Math.round((me.attrition - avg) * 10) / 10;
    out.push({
      tone: gap > 0 ? "warn" : "good",
      title: `${me.name} attrition is ${me.attrition}% — ${Math.abs(gap)} points ${gap > 0 ? "above" : "below"} the company`,
      body: `${v.regretted}% of exits were regretted. ${me.flightRisk} people in ${me.name} show two or more flight-risk signals.`,
    });
  }
  if (bestZone.training - worstZone.training >= 4) {
    out.push({
      tone: "warn",
      title: `${worstZone.zone} is ${bestZone.training - worstZone.training} points behind ${bestZone.zone} on training`,
      body: `${worstZone.training}% compliance against ${bestZone.training}%. The gap is concentrated in site-based roles — the same zone trails on communications reach.`,
    });
  }
  out.push({
    tone: v.netChange >= 0 ? "good" : "warn",
    title: v.netChange >= 0 ? `Headcount grew by ${v.netChange} over ${v.months} months` : `Headcount fell by ${-v.netChange} over ${v.months} months`,
    body: `${v.joiners} joiners against ${v.leavers} leavers. Internal moves filled ${v.internalFill}% of roles — the IJP is carrying real weight.`,
  });
  const genZ = Math.round(v.generations[0] * 100);
  out.push({
    tone: "good",
    title: `${genZ}% of this population is Gen Z`,
    body: `Average age ${v.avgAge}. The youngest cohort is the most mobile-first — it also moved most on communications open rate this quarter.`,
  });
  return out;
}
