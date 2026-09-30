/**
 * Engagement heat — which posts and discussions are gathering momentum, so HR
 * and Communications can focus where the conversation already is.
 *
 * The hub itself stays a high-level, one-to-many channel; peer discussion
 * lives in Viva Engage and is surfaced here, alongside AMA questions, stories,
 * polls and announcements. Illustrative demo data.
 */

import type { ZoneId } from "./hr";

export type HeatChannel =
  | "AMA question"
  | "Viva Engage thread"
  | "Announcement"
  | "Employee story"
  | "Poll"
  | "Leadership note";

export type HeatTopic = "Rewards" | "Safety" | "Careers" | "IPO" | "Culture" | "Policy" | "Wellbeing";

export type HeatItem = {
  id: string;
  title: string;
  channel: HeatChannel;
  topic: HeatTopic;
  source: string;
  posted: string;
  views: number;
  reactions: number;
  comments: number;
  shares: number;
  /** Engagement per day, oldest → today. */
  series: number[];
  sentiment: { pos: number; neu: number; neg: number };
  zones: Record<ZoneId, number>;
  topFunction: string;
  action: string;
  to: string;
};

export const heatItems: HeatItem[] = [
  {
    id: "h1",
    title: "Field allowances have not moved in two years while fuel has",
    channel: "AMA question",
    topic: "Rewards",
    source: "CEO Talks · September AMA",
    posted: "3d ago",
    views: 3120,
    reactions: 188,
    comments: 94,
    shares: 12,
    series: [40, 62, 88, 131, 176, 244, 318],
    sentiment: { pos: 18, neu: 41, neg: 41 },
    zones: { South: 22, West: 26, North: 29, East: 23 },
    topFunction: "Commercial",
    action: "Shortlist for the live AMA and prepare a written answer on the allowance review",
    to: "/leadership",
  },
  {
    id: "h2",
    title: "Will employees be offered shares in the IPO?",
    channel: "Viva Engage thread",
    topic: "IPO",
    source: "Viva Engage · All Company",
    posted: "2d ago",
    views: 2860,
    reactions: 142,
    comments: 131,
    shares: 38,
    series: [0, 0, 12, 58, 139, 227, 301],
    sentiment: { pos: 44, neu: 47, neg: 9 },
    zones: { South: 31, West: 27, North: 24, East: 18 },
    topFunction: "Enabling functions",
    action: "Publish an employee IPO FAQ — legal review before release",
    to: "/leadership",
  },
  {
    id: "h3",
    title: "Night-shift crews short-handed during CIP",
    channel: "Viva Engage thread",
    topic: "Safety",
    source: "Viva Engage · Plant Operations",
    posted: "1d ago",
    views: 1480,
    reactions: 121,
    comments: 76,
    shares: 9,
    series: [0, 0, 0, 0, 34, 118, 206],
    sentiment: { pos: 9, neu: 38, neg: 53 },
    zones: { South: 36, West: 14, North: 12, East: 38 },
    topFunction: "Manufacturing",
    action: "Escalate to EHS and reply from plant leadership within 24 hours",
    to: "/announcements/ann-line2-cip",
  },
  {
    id: "h4",
    title: "Plant operators rarely make it into corporate roles",
    channel: "AMA question",
    topic: "Careers",
    source: "CEO Talks · September AMA",
    posted: "4d ago",
    views: 2640,
    reactions: 214,
    comments: 58,
    shares: 21,
    series: [66, 91, 118, 142, 151, 163, 170],
    sentiment: { pos: 29, neu: 46, neg: 25 },
    zones: { South: 30, West: 22, North: 21, East: 27 },
    topFunction: "Manufacturing",
    action: "Answer live, then follow up with a shop-floor-to-manager career story",
    to: "/leadership",
  },
  {
    id: "h5",
    title: "Bengaluru Plant hits 30 days zero-loss-time",
    channel: "Employee story",
    topic: "Culture",
    source: "Company News",
    posted: "5d ago",
    views: 2884,
    reactions: 402,
    comments: 37,
    shares: 88,
    series: [210, 188, 164, 131, 112, 98, 91],
    sentiment: { pos: 82, neu: 16, neg: 2 },
    zones: { South: 61, West: 15, North: 13, East: 11 },
    topFunction: "Manufacturing",
    action: "Amplify to East and North — reach there is under a quarter of South",
    to: "/news/n3",
  },
  {
    id: "h6",
    title: "Which benefit would you most like improved?",
    channel: "Poll",
    topic: "Wellbeing",
    source: "Pulse · September",
    posted: "6d ago",
    views: 3410,
    reactions: 2104,
    comments: 0,
    shares: 14,
    series: [520, 410, 330, 276, 214, 180, 154],
    sentiment: { pos: 51, neu: 43, neg: 6 },
    zones: { South: 28, West: 27, North: 24, East: 21 },
    topFunction: "Commercial",
    action: "Share the result back — health cover led with 38% of votes",
    to: "/announcements",
  },
  {
    id: "h7",
    title: "Festive season safety stand-down",
    channel: "Announcement",
    topic: "Safety",
    source: "EHS Council · Mandatory",
    posted: "2d ago",
    views: 4412,
    reactions: 96,
    comments: 11,
    shares: 6,
    series: [0, 0, 0, 0, 0, 1880, 940],
    sentiment: { pos: 57, neu: 40, neg: 3 },
    zones: { South: 27, West: 25, North: 24, East: 24 },
    topFunction: "Manufacturing",
    action: "Working — 91% acknowledged. No action needed",
    to: "/announcements/ann-festive-safety",
  },
  {
    id: "h8",
    title: "Letter desk turnaround — still emailing HR?",
    channel: "Viva Engage thread",
    topic: "Policy",
    source: "Viva Engage · Ask HR",
    posted: "8d ago",
    views: 980,
    reactions: 44,
    comments: 29,
    shares: 2,
    series: [88, 72, 51, 40, 31, 22, 18],
    sentiment: { pos: 22, neu: 52, neg: 26 },
    zones: { South: 44, West: 21, North: 20, East: 15 },
    topFunction: "Enabling functions",
    action: "Cooling after the SLA announcement — close the thread with the new 24-hour SLA",
    to: "/announcements/ann-letters-sla",
  },
  {
    id: "h9",
    title: "Safety first this festive season",
    channel: "Leadership note",
    topic: "Safety",
    source: "Leadership Corner",
    posted: "9d ago",
    views: 2210,
    reactions: 131,
    comments: 8,
    shares: 19,
    series: [240, 160, 104, 71, 48, 32, 21],
    sentiment: { pos: 64, neu: 33, neg: 3 },
    zones: { South: 29, West: 26, North: 23, East: 22 },
    topFunction: "Manufacturing",
    action: "Cooling as expected — no follow-up required",
    to: "/news/n2",
  },
];

/**
 * Heat score, 0–100. Weighted engagement (comments and shares count most —
 * they are effort) blended with momentum over the last two days.
 */
export function heatScore(i: HeatItem) {
  const momentum = Math.min(100, Math.max(0, velocityOf(i)));
  return Math.round(heatRaw(i) * 0.6 + momentum * 0.4);
}

function engagement(i: HeatItem) {
  // A poll vote is one tap, so it counts for far less than a reaction.
  const reactionWeight = i.channel === "Poll" ? 0.03 : 0.15;
  return i.views * 0.02 + i.reactions * reactionWeight + i.comments * 0.6 + i.shares * 0.8;
}

const maxEngagement = Math.max(...heatItems.map(engagement));

/** Engagement normalised against the most-engaged item, 0–100. */
function heatRaw(i: HeatItem) {
  return (engagement(i) / maxEngagement) * 100;
}

/** % change: last day against the average of the two days before it. */
export function velocityOf(i: HeatItem) {
  const s = i.series;
  const last = s[s.length - 1];
  const before = (s[s.length - 2] + s[s.length - 3]) / 2;
  if (before <= 0) return last > 0 ? 100 : 0;
  return Math.round(((last - before) / before) * 100);
}

export type HeatState = "Heating up" | "Steady" | "Cooling";

export function heatState(i: HeatItem): HeatState {
  const v = velocityOf(i);
  if (v >= 20) return "Heating up";
  if (v <= -15) return "Cooling";
  return "Steady";
}

/** Rising fast with a negative skew — the conversations that need a response. */
export function needsAttention(i: HeatItem) {
  return velocityOf(i) >= 20 && i.sentiment.neg >= 30;
}

export const HEAT_TOPICS: HeatTopic[] = ["Rewards", "Safety", "Careers", "IPO", "Culture", "Policy", "Wellbeing"];
export const HEAT_CHANNELS: (HeatChannel | "All")[] = [
  "All",
  "AMA question",
  "Viva Engage thread",
  "Announcement",
  "Employee story",
  "Poll",
  "Leadership note",
];

export function rankedHeat(channel: HeatChannel | "All" = "All") {
  return heatItems
    .filter((i) => channel === "All" || i.channel === channel)
    .map((i) => ({ ...i, heat: heatScore(i), velocity: velocityOf(i), state: heatState(i) }))
    .sort((a, b) => b.heat - a.heat);
}

/** Topic × zone intensity, 0–100, from engagement-weighted zone shares. */
export function topicZoneMatrix() {
  const zones: ZoneId[] = ["South", "West", "North", "East"];
  const cells = HEAT_TOPICS.map((t) => {
    const items = heatItems.filter((i) => i.topic === t);
    return zones.map((z) =>
      items.reduce((s, i) => s + (heatRaw(i) + Math.max(0, velocityOf(i)) * 0.4) * (i.zones[z] / 100), 0)
    );
  });
  const max = Math.max(1, ...cells.flat());
  return {
    zones,
    rows: HEAT_TOPICS.map((t, r) => ({ topic: t, values: cells[r].map((v) => Math.round((v / max) * 100)) })),
  };
}

export function heatTotals() {
  const r = rankedHeat();
  return {
    heating: r.filter((i) => i.state === "Heating up").length,
    attention: r.filter(needsAttention).length,
    conversations: r.reduce((s, i) => s + i.comments, 0),
    reactions: r.reduce((s, i) => s + i.reactions, 0),
  };
}
