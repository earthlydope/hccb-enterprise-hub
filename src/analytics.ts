/**
 * Communications analytics.
 *
 * Answers the questions the Communications team asked for directly:
 * which region, which function, which age group opened which story, on what
 * device, at what hour — and which *format* of communication actually lands.
 *
 * Figures are illustrative demo data shaped to HCCB's published footprint
 * (5,000+ employees, 14 factories, 12 states, 32 warehouses).
 */

export type Trend = { label: string; value: number; delta?: number };

/* ---------- Headline ---------- */

export const reachHeadline = {
  audience: 5184,
  reached: 4412,
  opened: 3218,
  readThrough: 1976,
  acted: 842,
};

export const headlineCards = [
  { id: "reach", label: "Reach", value: "85%", sub: "4,412 of 5,184 employees", delta: +6, tone: "good" as const },
  { id: "open", label: "Open rate", value: "62%", sub: "3,218 opened at least one item", delta: +11, tone: "good" as const },
  { id: "read", label: "Read-through", value: "38%", sub: "Finished the full story", delta: -3, tone: "warn" as const },
  { id: "mobile", label: "Mobile share", value: "74%", sub: "Of all opens this month", delta: +9, tone: "good" as const },
];

/* ---------- Cuts of the audience ---------- */

export const byZone: Trend[] = [
  { label: "South", value: 88, delta: +4 },
  { label: "West", value: 81, delta: +7 },
  { label: "North", value: 63, delta: -2 },
  { label: "East", value: 57, delta: +1 },
];

export const byFunction: Trend[] = [
  { label: "Enabling functions", value: 94, delta: +2 },
  { label: "Commercial", value: 78, delta: +9 },
  { label: "Supply chain", value: 64, delta: +5 },
  { label: "Manufacturing", value: 52, delta: +12 },
];

export const byAge: Trend[] = [
  { label: "21–30", value: 71, delta: +14 },
  { label: "31–40", value: 82, delta: +6 },
  { label: "41–50", value: 66, delta: +2 },
  { label: "51+", value: 48, delta: -4 },
];

export const byDevice = [
  { label: "Mobile", value: 74, color: "#f40009" },
  { label: "Desktop", value: 18, color: "#0f172a" },
  { label: "Plant TV screens", value: 8, color: "#d97706" },
];

export const byLanguage: Trend[] = [
  { label: "English", value: 58 },
  { label: "हिन्दी", value: 16 },
  { label: "తెలుగు", value: 9 },
  { label: "ಕನ್ನಡ", value: 8 },
  { label: "தமிழ்", value: 5 },
  { label: "मराठी", value: 4 },
];

/** Opens by hour, 06:00 → 22:00. Drives the "when to publish" heatmap. */
export const byHour = [
  { h: 6, v: 12 }, { h: 7, v: 34 }, { h: 8, v: 71 }, { h: 9, v: 94 },
  { h: 10, v: 78 }, { h: 11, v: 52 }, { h: 12, v: 44 }, { h: 13, v: 61 },
  { h: 14, v: 38 }, { h: 15, v: 29 }, { h: 16, v: 33 }, { h: 17, v: 47 },
  { h: 18, v: 68 }, { h: 19, v: 58 }, { h: 20, v: 41 }, { h: 21, v: 24 },
  { h: 22, v: 11 },
];

/* ---------- Which format of communication works ---------- */

export type FormatRow = {
  id: string;
  format: string;
  hint: string;
  sent: number;
  openRate: number;
  completion: number;
  interactions: number;
  verdict: "Working" | "Steady" | "Fading";
};

export const byFormat: FormatRow[] = [
  {
    id: "ama",
    format: "Ask Me Anything",
    hint: "CEO Talks · live + written replies",
    sent: 3,
    openRate: 79,
    completion: 64,
    interactions: 1842,
    verdict: "Working",
  },
  {
    id: "story",
    format: "Employee story",
    hint: "People-first features",
    sent: 14,
    openRate: 68,
    completion: 51,
    interactions: 906,
    verdict: "Working",
  },
  {
    id: "poll",
    format: "Poll / pulse",
    hint: "One-tap sentiment",
    sent: 9,
    openRate: 61,
    completion: 58,
    interactions: 2104,
    verdict: "Working",
  },
  {
    id: "leader",
    format: "Leadership note",
    hint: "Written message from a leader",
    sent: 11,
    openRate: 54,
    completion: 33,
    interactions: 288,
    verdict: "Steady",
  },
  {
    id: "didyouknow",
    format: "Did you know",
    hint: "Short fact card",
    sent: 22,
    openRate: 34,
    completion: 29,
    interactions: 112,
    verdict: "Fading",
  },
  {
    id: "circular",
    format: "Policy circular",
    hint: "Long-form PDF notice",
    sent: 17,
    openRate: 28,
    completion: 14,
    interactions: 41,
    verdict: "Fading",
  },
];

/* ---------- Story-level performance ---------- */

export type StoryRow = {
  id: string;
  title: string;
  format: string;
  published: string;
  reach: number;
  openRate: number;
  avgSeconds: number;
  topZone: string;
  topFunction: string;
};

export const storyRows: StoryRow[] = [
  {
    id: "s1",
    title: "CEO Talks — September Ask Me Anything",
    format: "Ask Me Anything",
    published: "18 Sep",
    reach: 4180,
    openRate: 79,
    avgSeconds: 214,
    topZone: "South",
    topFunction: "Commercial",
  },
  {
    id: "s2",
    title: "Water Positive 2026 — the pledge wall is open",
    format: "Campaign",
    published: "15 Sep",
    reach: 3902,
    openRate: 66,
    avgSeconds: 96,
    topZone: "West",
    topFunction: "Manufacturing",
  },
  {
    id: "s3",
    title: "Festive season safety stand-down",
    format: "Mandatory notice",
    published: "21 Sep",
    reach: 4412,
    openRate: 91,
    avgSeconds: 62,
    topZone: "South",
    topFunction: "Manufacturing",
  },
  {
    id: "s4",
    title: "Bengaluru Plant hits 30 days zero-loss-time",
    format: "Employee story",
    published: "20 Sep",
    reach: 2884,
    openRate: 71,
    avgSeconds: 118,
    topZone: "South",
    topFunction: "Manufacturing",
  },
  {
    id: "s5",
    title: "Payroll cut-off moves to 24 Sep",
    format: "HR alert",
    published: "20 Sep",
    reach: 4020,
    openRate: 74,
    avgSeconds: 41,
    topZone: "North",
    topFunction: "Enabling functions",
  },
  {
    id: "s6",
    title: "New internal jobs: Territory Manager — East",
    format: "Did you know",
    published: "19 Sep",
    reach: 1602,
    openRate: 31,
    avgSeconds: 28,
    topZone: "East",
    topFunction: "Commercial",
  },
];

/* ---------- What the numbers imply ---------- */

export const insights = [
  {
    id: "i1",
    tone: "good" as const,
    title: "Manufacturing reach is up 12 points",
    body: "Plant TV screens plus Teams mobile lifted factory opens from 40% to 52%. The 08:00–09:00 shift-change window is doing the work.",
  },
  {
    id: "i2",
    tone: "warn" as const,
    title: "“Did you know” has stopped landing",
    body: "34% open, 29% completion across 22 sends. Ask Me Anything and polls out-perform it four to one on interaction — shift the frequency, not the audience.",
  },
  {
    id: "i3",
    tone: "warn" as const,
    title: "East zone is 31 points behind South",
    body: "57% reach against 88%. Language coverage is the likely cause — only 4% of opens are in a language other than English or Hindi in that zone.",
  },
  {
    id: "i4",
    tone: "good" as const,
    title: "Publish before 09:30 or after 18:00",
    body: "Two clear peaks: shift start and the evening commute. Midday sends lose roughly half the opens of a 09:00 send.",
  },
];
