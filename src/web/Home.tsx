import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "../ui";
import { toast, useHub } from "../store";
import { isManager, isPlant, isSupport } from "../personas";
import {
  amaSessions,
  apps,
  ceo,
  formatDay,
  localisedAnnouncement,
  newsItems,
  personalFeed,
} from "../data";
import { headlineCards } from "../analytics";

const kindLook: Record<string, { icon: string; bg: string; color: string }> = {
  Mandatory: { icon: "priority_high", bg: "#fef2f2", color: "#f40009" },
  Policy: { icon: "gavel", bg: "#eff6ff", color: "#2563eb" },
  HR: { icon: "badge", bg: "#f5f3ff", color: "#7c3aed" },
  Event: { icon: "event", bg: "#fffbeb", color: "#d97706" },
  Campaign: { icon: "campaign", bg: "#ecfdf5", color: "#059669" },
  Announcement: { icon: "notifications_active", bg: "#f1f5f9", color: "#0f172a" },
};

export function WebHome() {
  const nav = useNavigate();
  const { user, slice, state, dispatch, pendingCount, myAnnouncements, needsAck, amaFeed } = useHub();
  const [ask, setAsk] = useState("");

  const hour = new Date().getHours();
  const part = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const manager = isManager(user);
  const plant = isPlant(user);
  const support = isSupport(user);
  const openTickets = slice.tickets.filter((t) => t.status !== "Resolved").length;

  const cards = personalFeed(user, {
    pending: pendingCount,
    openTickets,
    leaveDays: user.leaveDays,
    training: user.training,
  });

  const session = amaSessions[0];
  const amaOpen = amaFeed.filter((q) => q.sessionId === session.id);
  const topQ = [...amaOpen].sort((a, b) => b.upvotes - a.upvotes)[0];

  const actions = [
    { label: "Request leave", sub: `${user.leaveDays} days left`, icon: "calendar_month", bg: "#eff6ff", c: "#2563eb", to: "/services/leave" },
    { label: "Raise IT ticket", sub: `${openTickets} open`, icon: "support_agent", bg: "#fef2f2", c: "#f40009", to: "/services/it" },
    { label: "Download payslip", sub: user.nets, icon: "receipt_long", bg: "#ecfdf5", c: "#059669", to: "/workspace/payslips" },
    { label: "Book travel", sub: "Policy applies", icon: "flight", bg: "#f5f3ff", c: "#7c3aed", to: "/services/travel" },
    { label: "Apply internal job", sub: "3 open roles", icon: "work", bg: "#fffbeb", c: "#d97706", to: "/services/jobs" },
  ];

  const favApps = apps.filter((a) => slice.favApps.includes(a.id)).slice(0, 6);
  const appList = favApps.length ? favApps : apps.slice(0, 6);

  return (
    <>
      {/* ---------- Personalised greeting ---------- */}
      <section className="wa-hero">
        <div>
          <div className="k">{part}</div>
          <h1>{user.fullName}</h1>
          <div className="wa-chips">
            <span>
              <Icon name="factory" size={14} /> {user.location}
            </span>
            <span>
              <Icon name="badge" size={14} /> {user.department}
            </span>
            <span>{user.roleTitle}</span>
          </div>
        </div>
        <div className="wa-hero-stats">
          <button className="wa-hero-stat" onClick={() => nav("/workspace")}>
            <b>{manager ? pendingCount : support ? openTickets : user.leaveDays}</b>
            <span>{manager ? "Pending approvals" : support ? "Open tickets" : "Leave days"}</span>
          </button>
          <button className="wa-hero-stat" onClick={() => nav("/learning")}>
            <b>{user.training}%</b>
            <span>Training complete</span>
          </button>
          <button className="wa-hero-stat" onClick={() => nav("/announcements")}>
            <b>{myAnnouncements.length}</b>
            <span>Announcements for you</span>
          </button>
        </div>
      </section>

      {/* ---------- One-click actions ---------- */}
      <div className="wa-sec">
        <h2>One-click actions</h2>
        <button className="wa-link-btn" onClick={() => nav("/services")}>
          All HR services
        </button>
      </div>
      <div className="wa-actions">
        {actions.map((a) => (
          <button key={a.label} className="wa-action" onClick={() => nav(a.to)}>
            <i style={{ background: a.bg, color: a.c }}>
              <Icon name={a.icon} size={19} />
            </i>
            <div>
              <b>{a.label}</b>
              <br />
              <small>{a.sub}</small>
            </div>
          </button>
        ))}
      </div>

      <div className="wa-split" style={{ marginTop: 26 }}>
        {/* ================= LEFT ================= */}
        <div>
          {/* ---- Personalised announcements ---- */}
          <div className="wa-sec" style={{ marginTop: 0 }}>
            <h2>For {user.firstName}</h2>
            <span className="wa-sub">
              Targeted by location, department and role — {cards.length} items
            </span>
          </div>
          <div className="wa-grid wa-g2">
            {cards.slice(0, 2).map((c) => (
              <article
                key={c.id}
                className="wa-card"
                style={
                  c.tone === "brand"
                    ? { background: "linear-gradient(140deg,#f40009,#b8000c)", color: "#fff", border: 0 }
                    : c.tone === "dark"
                      ? { background: "linear-gradient(140deg,#1c1c1e,#3a3a3c)", color: "#fff", border: 0 }
                      : undefined
                }
              >
                <div
                  style={{
                    fontSize: 11.5,
                    fontWeight: 700,
                    letterSpacing: "-0.01em",
                    opacity: c.tone === "plain" ? 1 : 0.82,
                    color: c.tone === "plain" ? "var(--brand)" : undefined,
                  }}
                >
                  {c.eyebrow}
                </div>
                <h3 style={{ fontSize: 17, margin: "7px 0 6px", lineHeight: 1.22 }}>{c.title}</h3>
                <p
                  style={{
                    fontSize: 13,
                    lineHeight: 1.45,
                    margin: "0 0 12px",
                    color: c.tone === "plain" ? "var(--w-muted)" : "rgba(255,255,255,0.82)",
                  }}
                >
                  {c.body}
                </p>
                <div className="pa-why">
                  {c.reasons.map((r) => (
                    <span
                      key={r}
                      style={
                        c.tone === "plain"
                          ? { background: "rgba(17,17,20,0.05)", color: "var(--w-muted)" }
                          : undefined
                      }
                    >
                      {r}
                    </span>
                  ))}
                </div>
                <button
                  className={c.tone === "plain" ? "wa-cta sm" : "wa-cta sm ghost"}
                  style={
                    c.tone === "plain"
                      ? { marginTop: 14 }
                      : { marginTop: 14, background: "rgba(255,255,255,0.2)", color: "#fff" }
                  }
                  onClick={() => nav(c.cta.to)}
                >
                  {c.cta.label} <Icon name="arrow_forward" size={15} />
                </button>
              </article>
            ))}
          </div>

          {/* ---- Important announcements ---- */}
          <div className="wa-sec">
            <h2>Important Announcements</h2>
            <button className="wa-link-btn" onClick={() => nav("/announcements")}>
              View all
            </button>
          </div>
          {needsAck.length > 0 && (
            <p style={{ margin: "-4px 0 10px", fontSize: 12.5, fontWeight: 600, color: "var(--brand)" }}>
              {needsAck.length} notice{needsAck.length > 1 ? "s" : ""}{" "}
              {needsAck.length > 1 ? "need" : "needs"} your acknowledgement
            </p>
          )}
          <div className="wa-card flat" style={{ padding: "4px 18px" }}>
            <div className="wa-list">
              {myAnnouncements.slice(0, 4).map((a) => {
                const t = localisedAnnouncement(a, state.language);
                const look = kindLook[a.kind];
                const acked = slice.annAck.includes(a.id);
                return (
                  <div key={a.id} className="wa-row">
                    <span className="ico" style={{ background: look.bg, color: look.color }}>
                      <Icon name={look.icon} size={18} />
                    </span>
                    <div className="body">
                      <div className="ann-meta" style={{ marginBottom: 3 }}>
                        <span className={`tag ${a.priority === "Critical" ? "crit" : a.priority === "High" ? "high" : ""}`}>
                          {a.priority}
                        </span>
                        <span className="tag">{a.kind}</span>
                        {acked && <span className="tag done">Acknowledged</span>}
                      </div>
                      <h4>{t.title}</h4>
                      <small>
                        {a.owner} · expires {formatDay(a.expiresAt)}
                      </small>
                    </div>
                    {a.acknowledge && !acked ? (
                      <button
                        className="wa-cta sm"
                        onClick={() => {
                          dispatch({ type: "ACK_ANN", id: a.id });
                          toast(dispatch, "Acknowledgement recorded");
                        }}
                      >
                        Acknowledge
                      </button>
                    ) : (
                      <button className="wa-cta sm ghost" onClick={() => nav(`/announcements/${a.id}`)}>
                        Read
                      </button>
                    )}
                  </div>
                );
              })}
              {myAnnouncements.length === 0 && <div className="wa-empty">Nothing needs your attention.</div>}
            </div>
          </div>

          {/* ---- Company news ---- */}
          <div className="wa-sec">
            <h2>Company News</h2>
            <button className="wa-link-btn" onClick={() => nav("/news")}>
              Newsroom
            </button>
          </div>
          <button className="wa-news-hero" onClick={() => nav(`/news/${newsItems[0].id}`)}>
            <img src="/people/plant.jpg" alt="" />
            <div className="b">
              <span className="tag crit">{newsItems[0].category}</span>
              <h3>{newsItems[0].title}</h3>
              <p>{newsItems[0].body}</p>
              <small className="wa-sub" style={{ display: "block", marginTop: 8 }}>
                {newsItems[0].read} · {newsItems[0].time}
              </small>
            </div>
          </button>
          <div className="wa-card flat" style={{ padding: "4px 18px", marginTop: 12 }}>
            {newsItems.slice(1).map((n, i) => (
              <button key={n.id} className="wa-news-row" onClick={() => nav(`/news/${n.id}`)}>
                <span className="n">{String(i + 2).padStart(2, "0")}</span>
                <span style={{ flex: 1 }}>
                  <h4>{n.title}</h4>
                  <small>
                    {n.category} · {n.read} · {n.time}
                  </small>
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ================= RIGHT ================= */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* ---- CEO Talks ---- */}
          <section className="wa-ceo">
            <div className="wa-ceo-head">
              <img src={ceo.avatar} alt={ceo.name} />
              <div>
                <b>{ceo.name}</b>
                <small>{ceo.title}</small>
              </div>
              <span className="ceo-live" style={{ marginLeft: "auto" }}>
                <i /> QUESTIONS OPEN
              </span>
            </div>
            <h2>Ask Me Anything</h2>
            <p>
              {session.when} · {session.channel}. The most upvoted questions are answered live.
            </p>
            <form
              className="wa-ceo-ask"
              onSubmit={(e) => {
                e.preventDefault();
                const text = ask.trim();
                if (!text) return;
                dispatch({
                  type: "ASK_AMA",
                  question: {
                    id: crypto.randomUUID(),
                    sessionId: session.id,
                    author: user.fullName,
                    role: user.roleTitle,
                    lane: user.lane,
                    topic: "Culture",
                    text,
                    upvotes: 1,
                    status: "Pending",
                    mine: true,
                  },
                });
                setAsk("");
                toast(dispatch, "Question sent to the CEO desk");
                nav("/leadership");
              }}
            >
              <Icon name="help" size={18} />
              <input
                value={ask}
                onChange={(e) => setAsk(e.target.value)}
                placeholder={`Ask ${ceo.name.split(" ")[0]} a question…`}
              />
              <button type="submit">Send</button>
            </form>
            {topQ && (
              <button
                className="ceo-top"
                style={{ marginTop: 12 }}
                onClick={() => nav("/leadership")}
              >
                <span>TOP QUESTION · {topQ.upvotes} UPVOTES</span>
                {topQ.text}
              </button>
            )}
            <div className="wa-ceo-meta">
              <span>
                <b>{amaOpen.length}</b> questions
              </span>
              <span>
                <b>{session.registered.toLocaleString("en-IN")}</b> registered
              </span>
            </div>
          </section>

          {/* ---- Upcoming ---- */}
          <section className="wa-card">
            <h3>Upcoming & celebrations</h3>
            <p className="wa-sub" style={{ marginBottom: 10 }}>Next 7 days</p>
            <div className="wa-list">
              {[
                { d: "24", m: "Sep", t: "Leadership Quarterly Townhall", s: "3:00 PM IST · Teams Live", to: "/leadership" },
                { d: "25", m: "Sep", t: "Letter SLA goes live", s: "Shared Services", to: "/announcements/ann-letters-sla" },
                { d: "26", m: "Sep", t: "Meera Iyer · work anniversary", s: "8 years · Commercial", to: "/recognition" },
                { d: "30", m: "Sep", t: "Water Positive pledge closes", s: "Sustainability Office", to: "/news/n1" },
              ].map((e) => (
                <button key={e.t} className="wa-row" onClick={() => nav(e.to)}>
                  <span className="cal" style={{ width: 40, height: 40 }}>
                    <span>{e.m}</span>
                    <b>{e.d}</b>
                  </span>
                  <span className="body">
                    <h4>{e.t}</h4>
                    <small>{e.s}</small>
                  </span>
                  <Icon name="chevron_right" />
                </button>
              ))}
            </div>
          </section>

          {/* ---- My applications ---- */}
          <section className="wa-card">
            <h3>My applications</h3>
            <p className="wa-sub" style={{ marginBottom: 12 }}>Single sign-on · no second login</p>
            <div className="wa-grid wa-g3" style={{ gap: 10 }}>
              {appList.map((a) => (
                <button
                  key={a.id}
                  onClick={() => nav(`/apps/${a.id}`)}
                  style={{
                    border: "1px solid var(--w-line)",
                    borderRadius: 11,
                    padding: "12px 8px",
                    background: "#fff",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 7,
                  }}
                >
                  <span className="sys-mark" style={{ background: a.color, color: a.accent }}>
                    {a.initials}
                  </span>
                  <small style={{ fontSize: 11, fontWeight: 600, letterSpacing: "-0.01em" }}>{a.name}</small>
                </button>
              ))}
            </div>
          </section>

          {/* ---- My dashboard ---- */}
          <section className="wa-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <h3>My dashboard</h3>
              <button className="wa-link-btn" onClick={() => nav("/analytics")}>
                Full analytics
              </button>
            </div>
            <p className="wa-sub" style={{ marginBottom: 12 }}>
              {plant ? "Plant productivity" : support ? "Service desk" : "Communications reach"}
            </p>
            <div className="wa-grid wa-g2" style={{ gap: 10 }}>
              {headlineCards.slice(0, 4).map((c) => (
                <div key={c.id} style={{ background: "var(--w-bg)", borderRadius: 10, padding: "10px 12px" }}>
                  <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.03em" }}>{c.value}</div>
                  <div style={{ fontSize: 11.5, color: "var(--w-muted)", fontWeight: 600 }}>{c.label}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
