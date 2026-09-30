import { useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Icon } from "../ui";
import { toast, useHub } from "../store";
import { isManager, personas } from "../personas";
import {
  amaQuestions as seedAma,
  amaSessions,
  amaTopics,
  analyticsCards,
  announcementWindow,
  announcements,
  apps,
  audienceLabel,
  ceo,
  communities,
  copilotAnswer,
  DEMO_NOW,
  formatDay,
  governanceItems,
  jobs,
  knowledgeDocs,
  learningCourses,
  localisedAnnouncement,
  matchReasons,
  newsItems,
  recognitionFeed,
  services,
} from "../data";

const kindLook: Record<string, { icon: string; bg: string; color: string }> = {
  Mandatory: { icon: "priority_high", bg: "#fef2f2", color: "#f40009" },
  Policy: { icon: "gavel", bg: "#eff6ff", color: "#2563eb" },
  HR: { icon: "badge", bg: "#f5f3ff", color: "#7c3aed" },
  Event: { icon: "event", bg: "#fffbeb", color: "#d97706" },
  Campaign: { icon: "campaign", bg: "#ecfdf5", color: "#059669" },
  Announcement: { icon: "notifications_active", bg: "#f1f5f9", color: "#0f172a" },
};

const prioTag = (p: string) => (p === "Critical" ? "crit" : p === "High" ? "high" : "");

function Back() {
  const nav = useNavigate();
  return (
    <button className="wa-link-btn" style={{ marginBottom: 14 }} onClick={() => nav(-1)}>
      ← Back
    </button>
  );
}

/* ===================== NEWS ===================== */

export function WebNews() {
  const nav = useNavigate();
  const [cat, setCat] = useState("All");
  const cats = ["All", "Leadership", "Plant", "HR"];
  const list = newsItems.filter((n) => cat === "All" || n.category === cat);
  return (
    <>
      <h1 className="wa-h1">Company News</h1>
      <p className="wa-lede">
        One newsroom for the whole company — published once, targeted by location and function,
        measured for reach.
      </p>
      <div className="wa-pill-row">
        {cats.map((c) => (
          <button key={c} className={cat === c ? "wa-pill on" : "wa-pill"} onClick={() => setCat(c)}>
            {c}
          </button>
        ))}
      </div>
      {list[0] && (
        <button className="wa-news-hero" onClick={() => nav(`/news/${list[0].id}`)}>
          <img src="/people/plant.jpg" alt="" />
          <div className="b">
            <span className="tag crit">{list[0].category}</span>
            <h3>{list[0].title}</h3>
            <p>{list[0].body}</p>
            <small className="wa-sub" style={{ display: "block", marginTop: 8 }}>
              {list[0].read} · {list[0].time}
            </small>
          </div>
        </button>
      )}
      <div className="wa-grid wa-g3" style={{ marginTop: 16 }}>
        {list.slice(1).map((n) => (
          <button key={n.id} className="wa-card" style={{ textAlign: "left" }} onClick={() => nav(`/news/${n.id}`)}>
            <span className="tag">{n.category}</span>
            <h3 style={{ margin: "9px 0 6px", fontSize: 16, lineHeight: 1.25 }}>{n.title}</h3>
            <p className="wa-sub" style={{ lineHeight: 1.45 }}>{n.body.slice(0, 120)}…</p>
            <small className="wa-sub" style={{ display: "block", marginTop: 10 }}>
              {n.read} · {n.time}
            </small>
          </button>
        ))}
      </div>
    </>
  );
}

export function WebNewsDetail() {
  const { id } = useParams();
  const { dispatch, slice } = useHub();
  const item = newsItems.find((n) => n.id === id);
  if (!item) return null;
  const read = slice.newsRead.includes(item.id);
  return (
    <>
      <Back />
      <div style={{ maxWidth: 760 }}>
        <span className="tag crit">{item.category}</span>
        <h1 className="wa-h1" style={{ marginTop: 12 }}>{item.title}</h1>
        <p className="wa-sub" style={{ marginBottom: 18 }}>
          {item.read} · {item.time}
        </p>
        <img
          src="/people/plant.jpg"
          alt=""
          style={{ width: "100%", height: 300, objectFit: "cover", borderRadius: 14, marginBottom: 20 }}
        />
        <p style={{ fontSize: 16.5, lineHeight: 1.65, letterSpacing: "-0.011em" }}>{item.body}</p>
        <button
          className="wa-cta ghost"
          style={{ marginTop: 18 }}
          onClick={() => {
            dispatch({ type: "READ_NEWS", id: item.id });
            toast(dispatch, read ? "Already saved" : "Marked as read");
          }}
        >
          <Icon name={read ? "check" : "bookmark"} size={17} /> {read ? "Saved to recents" : "Mark as read"}
        </button>
      </div>
    </>
  );
}

/* ===================== LEADERSHIP CORNER ===================== */

const amaTabs = ["Top", "Answered", "My questions"] as const;

export function WebLeadership() {
  const { amaFeed, slice, dispatch, user } = useHub();
  const [sessionId, setSessionId] = useState(amaSessions[0].id);
  const [tab, setTab] = useState<(typeof amaTabs)[number]>("Top");
  const [text, setText] = useState("");
  const [topic, setTopic] = useState(amaTopics[0]);
  const [anon, setAnon] = useState(false);
  const session = amaSessions.find((s) => s.id === sessionId) ?? amaSessions[0];
  const registered = slice.amaRegistered.includes(session.id);

  const questions = useMemo(() => {
    const all = amaFeed.filter((q) => q.sessionId === session.id);
    if (tab === "Answered") return all.filter((q) => q.status === "Answered");
    if (tab === "My questions") return all.filter((q) => q.mine);
    return [...all].sort(
      (a, b) =>
        b.upvotes + (slice.amaUpvotes.includes(b.id) ? 1 : 0) -
        (a.upvotes + (slice.amaUpvotes.includes(a.id) ? 1 : 0))
    );
  }, [amaFeed, session.id, tab, slice.amaUpvotes]);

  const submit = () => {
    const body = text.trim();
    if (!body) return;
    dispatch({
      type: "ASK_AMA",
      question: {
        id: crypto.randomUUID(),
        sessionId: session.id,
        author: anon ? "Anonymous" : user.fullName,
        role: anon ? user.department : user.roleTitle,
        lane: user.lane,
        topic,
        text: body,
        upvotes: 1,
        status: "Pending",
        mine: true,
      },
    });
    setText("");
    toast(dispatch, anon ? "Question sent anonymously" : "Question sent to the CEO desk");
    setTab("My questions");
  };

  const answeredCount = seedAma.filter((q) => q.status === "Answered").length;

  return (
    <>
      <h1 className="wa-h1">Leadership Corner</h1>
      <p className="wa-lede">
        Direct line to the leadership team — CEO Talks, Ask Me Anything, and every answer on the
        record. Questions can be asked anonymously.
      </p>

      <div className="wa-split">
        <div>
          <section className="wa-ceo">
            <div className="wa-ceo-head">
              <img src={ceo.avatar} alt={ceo.name} />
              <div>
                <b>{ceo.name}</b>
                <small>{ceo.title}</small>
              </div>
              <span className="ceo-live" style={{ marginLeft: "auto" }}>
                <i /> {session.status.toUpperCase()}
              </span>
            </div>
            <h2>Ask Me Anything · {session.title.split(" · ")[0]}</h2>
            <p>
              {session.when} · {session.channel}
            </p>
            <p>{session.summary}</p>
            <div className="pa-why" style={{ marginBottom: 14 }}>
              {session.topics.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
            <button
              className="wa-cta"
              style={{ background: "#fff", color: "var(--brand)" }}
              onClick={() => {
                dispatch({ type: "REGISTER_AMA", id: session.id });
                toast(
                  dispatch,
                  registered
                    ? "Removed from your calendar"
                    : session.status === "Replay"
                      ? "Replay opening"
                      : "Added to your calendar"
                );
              }}
            >
              <Icon name={session.status === "Replay" ? "play_circle" : registered ? "event_available" : "event"} size={17} />
              {session.status === "Replay" ? "Watch replay" : registered ? "Registered" : "Register & remind me"}
            </button>
            <div className="wa-ceo-meta">
              <span>
                <b>{amaFeed.filter((q) => q.sessionId === session.id).length}</b> questions
              </span>
              <span>
                <b>{session.registered.toLocaleString("en-IN")}</b> registered
              </span>
              <span>
                <b>{answeredCount}</b> answered on record
              </span>
            </div>
          </section>

          {session.questionsOpen && (
            <div className="wa-card" style={{ marginTop: 16 }}>
              <h3>Ask a question</h3>
              <p className="wa-sub" style={{ marginBottom: 12 }}>
                Top-voted questions are answered live. Everything else gets a written reply within a week.
              </p>
              <div className="wa-field">
                <textarea
                  rows={3}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={`No filter. Ask ${ceo.name.split(" ")[0]} anything about the business.`}
                />
              </div>
              <div className="wa-pill-row">
                {amaTopics.map((t) => (
                  <button key={t} className={topic === t ? "wa-pill on" : "wa-pill"} onClick={() => setTopic(t)}>
                    {t}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                <button className="wa-pill" onClick={() => setAnon((v) => !v)}>
                  <Icon name={anon ? "check_box" : "check_box_outline_blank"} size={16} /> Ask anonymously
                </button>
                <button className="wa-cta" disabled={!text.trim()} onClick={submit}>
                  Send question
                </button>
              </div>
            </div>
          )}

          <div className="wa-pill-row" style={{ marginTop: 20 }}>
            {amaSessions.map((s) => (
              <button
                key={s.id}
                className={s.id === sessionId ? "wa-pill on" : "wa-pill"}
                onClick={() => {
                  setSessionId(s.id);
                  setTab(s.questionsOpen ? "Top" : "Answered");
                }}
              >
                {s.status === "Replay" ? "Replay · " : ""}
                {s.title.split(" · ")[0]}
              </button>
            ))}
            <span style={{ flex: 1 }} />
            {amaTabs.map((t) => (
              <button key={t} className={tab === t ? "wa-pill on" : "wa-pill"} onClick={() => setTab(t)}>
                {t}
              </button>
            ))}
          </div>

          {questions.length === 0 && (
            <div className="wa-card wa-empty">
              {tab === "My questions" ? "You have not asked anything in this session yet." : "Nothing here yet."}
            </div>
          )}
          {questions.map((q) => {
            const on = slice.amaUpvotes.includes(q.id);
            return (
              <div key={q.id} className="wa-card" style={{ marginBottom: 10, display: "flex", gap: 14 }}>
                <button
                  className={on ? "vote on" : "vote"}
                  onClick={() => dispatch({ type: "UPVOTE_AMA", id: q.id })}
                  aria-label="Upvote"
                >
                  <Icon name="keyboard_arrow_up" size={17} />
                  {q.upvotes + (on ? 1 : 0)}
                </button>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="ann-meta">
                    <span className="tag">{q.topic}</span>
                    {q.status === "Answered" && <span className="tag done">Answered</span>}
                    {q.status === "Shortlisted" && <span className="tag high">Shortlisted</span>}
                    {q.mine && <span className="tag dark">You</span>}
                  </div>
                  <p style={{ margin: "8px 0 4px", fontSize: 15, lineHeight: 1.45, letterSpacing: "-0.014em" }}>
                    {q.text}
                  </p>
                  <small className="wa-sub">
                    {q.author} · {q.role}
                  </small>
                  {q.answer && (
                    <div className="ama-answer" style={{ background: "var(--w-bg)" }}>
                      <b>
                        <img src={ceo.avatar} alt="" /> {ceo.name} · {q.answeredAt}
                      </b>
                      {q.answer}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <section className="wa-card">
            <h3>Leadership notes</h3>
            <p className="wa-sub" style={{ marginBottom: 8 }}>Written messages on the record</p>
            <div className="wa-list">
              {newsItems
                .filter((n) => n.category === "Leadership")
                .map((n) => (
                  <a key={n.id} className="wa-row" href={`/news/${n.id}`} onClick={(e) => e.preventDefault()}>
                    <span className="ico" style={{ background: "#fef2f2", color: "#f40009" }}>
                      <Icon name="record_voice_over" size={17} />
                    </span>
                    <span className="body">
                      <h4>{n.title}</h4>
                      <small>{n.time}</small>
                    </span>
                  </a>
                ))}
            </div>
          </section>
          <section className="wa-card">
            <h3>How questions are handled</h3>
            <div className="wa-list">
              {[
                ["how_to_vote", "Upvoting decides the running order"],
                ["visibility_off", "Anonymous questions are never de-anonymised"],
                ["record_voice_over", "Top questions answered live on the call"],
                ["mail", "Everything else gets a written reply in a week"],
              ].map(([i, t]) => (
                <div key={t} className="wa-row" style={{ cursor: "default" }}>
                  <span className="ico" style={{ background: "var(--w-bg)", color: "#3f3f46" }}>
                    <Icon name={i} size={17} />
                  </span>
                  <span className="body">
                    <h4 style={{ fontWeight: 500 }}>{t}</h4>
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

/* ===================== ANNOUNCEMENTS ===================== */

const annKinds = ["All", "Mandatory", "Policy", "HR", "Event", "Campaign"] as const;

export function WebAnnouncements() {
  const nav = useNavigate();
  const { myAnnouncements, needsAck, slice, dispatch, state, user } = useHub();
  const [kind, setKind] = useState<(typeof annKinds)[number]>("All");
  const live = kind === "All" ? myAnnouncements : myAnnouncements.filter((a) => a.kind === kind);

  return (
    <>
      <h1 className="wa-h1">Announcements</h1>
      <p className="wa-lede">
        Targeted to {user.department} · {user.location}. {needsAck.length} awaiting your
        acknowledgement.
      </p>
      <div className="wa-pill-row">
        {annKinds.map((k) => (
          <button key={k} className={kind === k ? "wa-pill on" : "wa-pill"} onClick={() => setKind(k)}>
            {k}
          </button>
        ))}
      </div>
      {live.length === 0 && <div className="wa-card wa-empty">No {kind.toLowerCase()} announcements are live for you.</div>}
      <div className="wa-grid wa-g2">
        {live.map((a) => {
          const t = localisedAnnouncement(a, state.language);
          const look = kindLook[a.kind];
          const acked = slice.annAck.includes(a.id);
          return (
            <article key={a.id} className="wa-card">
              <div style={{ display: "flex", gap: 12 }}>
                <span
                  className="ico"
                  style={{ background: look.bg, color: look.color, width: 36, height: 36, borderRadius: 10, display: "grid", placeItems: "center", flexShrink: 0 }}
                >
                  <Icon name={look.icon} size={19} />
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="ann-meta">
                    <span className={`tag ${prioTag(a.priority)}`}>{a.priority}</span>
                    <span className="tag">{a.kind}</span>
                    {acked && <span className="tag done">Acknowledged</span>}
                  </div>
                  <h3 style={{ margin: "8px 0 5px", fontSize: 15.5, lineHeight: 1.28 }}>{t.title}</h3>
                  <p className="wa-sub" style={{ lineHeight: 1.45 }}>{t.body.slice(0, 130)}…</p>
                  <small className="wa-sub" style={{ display: "block", marginTop: 8 }}>
                    {a.owner} · expires {formatDay(a.expiresAt)} · {audienceLabel(a.audience)}
                  </small>
                  <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                    <button className="wa-cta sm ghost" onClick={() => nav(`/announcements/${a.id}`)}>
                      Read
                    </button>
                    {a.acknowledge && !acked && (
                      <button
                        className="wa-cta sm"
                        onClick={() => {
                          dispatch({ type: "ACK_ANN", id: a.id });
                          toast(dispatch, "Acknowledgement recorded");
                        }}
                      >
                        Acknowledge
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}

export function WebAnnouncementDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const { slice, dispatch, state, user } = useHub();
  const item = announcements.find((a) => a.id === id);
  if (!item) return null;
  const t = localisedAnnouncement(item, state.language);
  const acked = slice.annAck.includes(item.id);
  const win = announcementWindow(item, DEMO_NOW);
  return (
    <>
      <Back />
      <div className="wa-split">
        <div style={{ maxWidth: 740 }}>
          <div className="ann-meta">
            <span className={`tag ${prioTag(item.priority)}`}>{item.priority}</span>
            <span className="tag">{item.kind}</span>
            <span className={`tag ${win === "Live" ? "done" : ""}`}>{win}</span>
            {acked && <span className="tag done">Acknowledged</span>}
          </div>
          <h1 className="wa-h1" style={{ marginTop: 12 }}>{t.title}</h1>
          <p className="wa-sub" style={{ marginBottom: 16 }}>
            {item.owner} · published {formatDay(item.publishedAt)} · expires {formatDay(item.expiresAt)}
          </p>
          {item.media && (
            <img src={item.media} alt="" style={{ width: "100%", height: 260, objectFit: "cover", borderRadius: 14, marginBottom: 18 }} />
          )}
          <p style={{ fontSize: 16.5, lineHeight: 1.65, letterSpacing: "-0.011em" }}>{t.body}</p>
          <div className="wa-card" style={{ marginTop: 18 }}>
            <h3>Detail</h3>
            <div className="wa-list">
              {item.detail.map((d) => (
                <div key={d} className="wa-row" style={{ cursor: "default" }}>
                  <span className="ico" style={{ background: "var(--w-bg)", color: "#1a7f37", width: 26, height: 26, borderRadius: 7 }}>
                    <Icon name="check" size={15} />
                  </span>
                  <span className="body">
                    <h4 style={{ fontWeight: 500 }}>{d}</h4>
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
            {item.acknowledge &&
              (acked ? (
                <button className="wa-cta ghost" disabled>
                  Acknowledged
                </button>
              ) : (
                <button
                  className="wa-cta"
                  onClick={() => {
                    dispatch({ type: "ACK_ANN", id: item.id });
                    toast(dispatch, "Acknowledgement recorded");
                  }}
                >
                  I acknowledge this notice
                </button>
              ))}
            {item.cta && (
              <button className="wa-cta ghost" onClick={() => nav(item.cta!.to)}>
                {item.cta.label}
              </button>
            )}
          </div>
        </div>
        <div className="wa-card">
          <h3>Audience</h3>
          <p className="wa-sub" style={{ marginBottom: 10 }}>{audienceLabel(item.audience)}</p>
          <div className="ann-meta">
            {matchReasons(item.audience, user).map((r) => (
              <span key={r} className="tag">
                {r}
              </span>
            ))}
          </div>
          <p className="wa-sub" style={{ marginTop: 12 }}>
            You are seeing this because your profile matches the targeting rules for this notice.
          </p>
        </div>
      </div>
    </>
  );
}

/* ===================== KNOWLEDGE ===================== */

export function WebKnowledge() {
  const nav = useNavigate();
  const [type, setType] = useState("All");
  const types = ["All", "SOP", "Policy", "Playbook", "HR Document"];
  const list = knowledgeDocs.filter((d) => type === "All" || d.type === type);
  return (
    <>
      <h1 className="wa-h1">Policies & SOPs</h1>
      <p className="wa-lede">
        Every document has a named owner and a review date. Results are permission-trimmed — you
        only ever see what you may already open.
      </p>
      <div className="wa-pill-row">
        {types.map((t) => (
          <button key={t} className={type === t ? "wa-pill on" : "wa-pill"} onClick={() => setType(t)}>
            {t}
          </button>
        ))}
      </div>
      <div className="wa-grid wa-g3">
        {list.map((d) => (
          <button key={d.id} className="wa-card" style={{ textAlign: "left" }} onClick={() => nav(`/knowledge/${d.id}`)}>
            <div className="ann-meta">
              <span className="tag">{d.type}</span>
              <span className="tag">{d.version}</span>
            </div>
            <h3 style={{ margin: "9px 0 6px", fontSize: 15.5, lineHeight: 1.25 }}>{d.title}</h3>
            <p className="wa-sub" style={{ lineHeight: 1.45 }}>{d.snippet}</p>
            <small className="wa-sub" style={{ display: "block", marginTop: 10 }}>
              {d.owner} · reviewed {d.updated}
            </small>
          </button>
        ))}
      </div>
    </>
  );
}

export function WebKnowledgeDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const { slice, dispatch } = useHub();
  const doc = knowledgeDocs.find((d) => d.id === id);
  if (!doc) return null;
  const saved = slice.bookmarks.includes(doc.id);
  return (
    <>
      <Back />
      <div className="wa-split">
        <div style={{ maxWidth: 740 }}>
          <div className="ann-meta">
            <span className="tag">{doc.type}</span>
            <span className="tag">{doc.version}</span>
            <span className="tag done">Current</span>
          </div>
          <h1 className="wa-h1" style={{ marginTop: 12 }}>{doc.title}</h1>
          <p className="wa-sub" style={{ marginBottom: 20 }}>
            {doc.department} · owner {doc.owner} · reviewed {doc.reviewed} · source {doc.source}
          </p>
          {doc.body.map((b, i) => (
            <p key={i} style={{ fontSize: 16, lineHeight: 1.65, letterSpacing: "-0.011em" }}>
              {b}
            </p>
          ))}
          <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
            <button
              className="wa-cta"
              onClick={() => {
                dispatch({ type: "TOGGLE_BOOKMARK", id: doc.id });
                toast(dispatch, saved ? "Bookmark removed" : "Bookmarked");
              }}
            >
              <Icon name={saved ? "bookmark" : "bookmark_border"} size={17} /> {saved ? "Bookmarked" : "Bookmark"}
            </button>
            <button className="wa-cta ghost" onClick={() => nav(`/copilot?q=${encodeURIComponent("Summarise " + doc.title)}`)}>
              <Icon name="auto_awesome" size={17} /> Ask the AI Assistant
            </button>
          </div>
        </div>
        <div className="wa-card">
          <h3>Related</h3>
          <div className="wa-list">
            {doc.related.map((r) => {
              const d = knowledgeDocs.find((x) => x.id === r);
              if (!d) return null;
              return (
                <button key={r} className="wa-row" onClick={() => nav(`/knowledge/${r}`)}>
                  <span className="ico" style={{ background: "var(--w-bg)" }}>
                    <Icon name="description" size={17} />
                  </span>
                  <span className="body">
                    <h4>{d.title}</h4>
                    <small>{d.type}</small>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

/* ===================== WORKSPACE ===================== */

const wsFilters = ["Pending", "Approved", "Rejected", "All"] as const;

export function WebWorkspace() {
  const nav = useNavigate();
  const { state, slice, user, dispatch, pendingCount } = useHub();
  const [tab, setTab] = useState<(typeof wsFilters)[number]>("Pending");
  const manager = isManager(user);
  const items = state.approvals.filter((a) => (tab === "All" ? true : a.status === tab));
  const openTickets = slice.tickets.filter((t) => t.status !== "Resolved");

  return (
    <>
      <h1 className="wa-h1">My Workspace</h1>
      <p className="wa-lede">
        Payslips, leave, claims, letters and training — plus anything waiting on your decision.
      </p>
      <div className="wa-grid wa-g4">
        {[
          { l: manager ? "Pending approvals" : "Open tickets", v: manager ? pendingCount : openTickets.length },
          { l: "Leave balance", v: `${user.leaveDays}d` },
          { l: "Last net pay", v: user.nets },
          { l: "Training", v: `${user.training}%` },
        ].map((s) => (
          <div key={s.l} className="wa-card wa-kpi">
            <span className="l">{s.l}</span>
            <span className="v">{s.v}</span>
          </div>
        ))}
      </div>

      {manager && (
        <>
          <div className="wa-sec">
            <h2>Approval queue</h2>
            <div className="wa-pill-row" style={{ margin: 0 }}>
              {wsFilters.map((f) => (
                <button key={f} className={tab === f ? "wa-pill on" : "wa-pill"} onClick={() => setTab(f)}>
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="wa-card">
            <table className="wa-table">
              <thead>
                <tr>
                  <th>Request</th>
                  <th>Type</th>
                  <th>Requester</th>
                  <th>Amount</th>
                  <th>Submitted</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {items.map((a) => (
                  <tr key={a.id}>
                    <td className="t">
                      {a.title}
                      <br />
                      <small className="wa-sub">{a.summary}</small>
                    </td>
                    <td>
                      <span className="tag">{a.type}</span>
                    </td>
                    <td>
                      {a.requester}
                      <br />
                      <small className="wa-sub">{a.requesterRole}</small>
                    </td>
                    <td className="n">{a.amount ?? "—"}</td>
                    <td>
                      <small className="wa-sub">{a.submitted}</small>
                    </td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      {a.status === "Pending" ? (
                        <>
                          <button
                            className="wa-cta sm"
                            onClick={() => {
                              dispatch({ type: "SET_APPROVAL", id: a.id, status: "Approved" });
                              toast(dispatch, `${a.id} approved`);
                            }}
                          >
                            Approve
                          </button>{" "}
                          <button
                            className="wa-cta sm ghost"
                            onClick={() => {
                              dispatch({ type: "SET_APPROVAL", id: a.id, status: "Rejected" });
                              toast(dispatch, `${a.id} rejected`);
                            }}
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <span className={`tag ${a.status === "Approved" ? "done" : "crit"}`}>{a.status}</span>
                      )}
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={6} className="wa-empty">
                      Nothing in {tab.toLowerCase()}.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      <div className="wa-split" style={{ marginTop: 26 }}>
        <div className="wa-card">
          <h3>My requests</h3>
          <p className="wa-sub" style={{ marginBottom: 10 }}>Tickets, leave and travel on your record</p>
          <div className="wa-list">
            {slice.tickets.map((t) => (
              <div key={t.id} className="wa-row" style={{ cursor: "default" }}>
                <span className="ico" style={{ background: "#eff6ff", color: "#2563eb" }}>
                  <Icon name="confirmation_number" size={17} />
                </span>
                <span className="body">
                  <h4>{t.title}</h4>
                  <small>
                    {t.id} · {t.category} · {t.updated}
                  </small>
                </span>
                <span className={`tag ${t.status === "Resolved" ? "done" : t.priority === "High" ? "crit" : "high"}`}>
                  {t.status}
                </span>
              </div>
            ))}
            {slice.leaves.map((l) => (
              <div key={l.id} className="wa-row" style={{ cursor: "default" }}>
                <span className="ico" style={{ background: "#ecfdf5", color: "#059669" }}>
                  <Icon name="calendar_month" size={17} />
                </span>
                <span className="body">
                  <h4>
                    {l.type} · {l.days} day{l.days > 1 ? "s" : ""}
                  </h4>
                  <small>
                    {l.from} → {l.to} · {l.note}
                  </small>
                </span>
                <span className={`tag ${l.status === "Approved" ? "done" : "high"}`}>{l.status}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="wa-card">
          <h3>Documents & payslips</h3>
          <p className="wa-sub" style={{ marginBottom: 10 }}>Authorised copies for {user.fullName}</p>
          <div className="wa-list">
            {["September 2026", "August 2026", "July 2026"].map((m) => (
              <button key={m} className="wa-row" onClick={() => toast(dispatch, `${m} payslip downloaded`)}>
                <span className="ico" style={{ background: "var(--w-bg)" }}>
                  <Icon name="receipt_long" size={17} />
                </span>
                <span className="body">
                  <h4>Payslip · {m}</h4>
                  <small>Net {user.nets}</small>
                </span>
                <Icon name="download" />
              </button>
            ))}
            <button className="wa-row" onClick={() => nav("/services/letters")}>
              <span className="ico" style={{ background: "var(--w-bg)" }}>
                <Icon name="description" size={17} />
              </span>
              <span className="body">
                <h4>Employee letters</h4>
                <small>Employment · address · salary</small>
              </span>
              <Icon name="chevron_right" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ===================== SERVICES ===================== */

export function WebServices() {
  const nav = useNavigate();
  const { dispatch, user, slice } = useHub();
  const groups = ["HR", "IT", "Work"];
  return (
    <>
      <h1 className="wa-h1">HR Services & IT Support</h1>
      <p className="wa-lede">
        Self-service for the requests that used to move by email — each one routed, tracked and
        visible end to end.
      </p>
      <div className="wa-grid wa-g4" style={{ marginBottom: 8 }}>
        {[
          { l: "Leave balance", v: `${user.leaveDays} days`, i: "calendar_month" },
          { l: "Open tickets", v: String(slice.tickets.filter((t) => t.status !== "Resolved").length), i: "confirmation_number" },
          { l: "Letters issued", v: String(slice.letters.length), i: "description" },
          { l: "Open roles", v: String(jobs.length), i: "work" },
        ].map((s) => (
          <div key={s.l} className="wa-card wa-kpi">
            <span className="l">{s.l}</span>
            <span className="v">{s.v}</span>
          </div>
        ))}
      </div>
      {groups.map((g) => (
        <div key={g}>
          <div className="wa-sec">
            <h2>{g === "Work" ? "Function hubs" : g === "HR" ? "HR services" : "IT support"}</h2>
          </div>
          <div className="wa-grid wa-g4">
            {services
              .filter((s) => s.group === g)
              .map((s) => (
                <button key={s.id} className="wa-action" onClick={() => nav(s.to)}>
                  <i style={{ background: "#fef2f2", color: "#f40009" }}>
                    <Icon name={s.icon} size={19} />
                  </i>
                  <b>{s.name}</b>
                </button>
              ))}
          </div>
        </div>
      ))}
      <div className="wa-card" style={{ marginTop: 22 }}>
        <h3>Raise a request</h3>
        <p className="wa-sub" style={{ marginBottom: 14 }}>
          Goes to the same queue as the mobile app — tracked under My Workspace.
        </p>
        <div className="wa-grid wa-g2">
          <div className="wa-field">
            <label>Request type</label>
            <select defaultValue="IT incident">
              <option>IT incident</option>
              <option>Leave request</option>
              <option>Travel booking</option>
              <option>Employee letter</option>
            </select>
          </div>
          <div className="wa-field">
            <label>Priority</label>
            <select defaultValue="Medium">
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
        </div>
        <div className="wa-field">
          <label>Describe the issue</label>
          <textarea rows={3} placeholder="What do you need?" />
        </div>
        <button
          className="wa-cta"
          onClick={() => {
            dispatch({
              type: "ADD_TICKET",
              ticket: {
                id: `INC-${Math.floor(20000 + Math.random() * 9999)}`,
                title: "Request raised from web hub",
                category: "Service desk",
                priority: "Medium",
                status: "Open",
                updated: "Just now",
              },
            });
            toast(dispatch, "Request submitted — tracked in My Workspace");
          }}
        >
          Submit request
        </button>
      </div>
    </>
  );
}

/* ===================== LEARNING / COMMUNITIES / RECOGNITION ===================== */

export function WebLearning() {
  const { slice, dispatch, user } = useHub();
  return (
    <>
      <h1 className="wa-h1">Learning Hub</h1>
      <p className="wa-lede">
        Assigned learning, compliance modules and role-matched recommendations. You are at{" "}
        {user.training}% on required modules.
      </p>
      <div className="wa-grid wa-g2">
        {learningCourses.map((c) => {
          const p = slice.courses[c.id] ?? c.progress;
          return (
            <div key={c.id} className="wa-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                <h3>{c.title}</h3>
                <span className={`tag ${c.required ? "crit" : ""}`}>{c.required ? "Required" : "Optional"}</span>
              </div>
              <p className="wa-sub" style={{ marginBottom: 12 }}>Due {c.due}</p>
              <div className="progress">
                <span style={{ width: `${p}%` }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
                <small className="wa-sub">{p}% complete</small>
                <button
                  className="wa-cta sm"
                  onClick={() => {
                    dispatch({ type: "COURSE", id: c.id, progress: Math.min(100, p + 20) });
                    toast(dispatch, p + 20 >= 100 ? "Course completed" : "Progress saved");
                  }}
                >
                  {p >= 100 ? "Completed" : "Continue"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export function WebCommunities() {
  const { dispatch } = useHub();
  const [joined, setJoined] = useState<string[]>(["g1", "g2"]);
  return (
    <>
      <h1 className="wa-h1">Employee Communities</h1>
      <p className="wa-lede">
        Cross-plant groups, department spaces and interest communities — the conversational side of
        the hub.
      </p>
      <div className="wa-grid wa-g3">
        {communities.map((g) => (
          <div key={g.id} className="wa-card">
            <h3>{g.name}</h3>
            <p className="wa-sub" style={{ marginBottom: 12 }}>
              {g.members} members · {g.last}
            </p>
            <button
              className={joined.includes(g.id) ? "wa-cta sm ghost" : "wa-cta sm"}
              onClick={() => {
                setJoined((j) => (j.includes(g.id) ? j.filter((x) => x !== g.id) : [...j, g.id]));
                toast(dispatch, joined.includes(g.id) ? `Left ${g.name}` : `Joined ${g.name}`);
              }}
            >
              {joined.includes(g.id) ? "Leave" : "Join"}
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

export function WebRecognition() {
  const { dispatch, user } = useHub();
  const [text, setText] = useState("");
  const [feed, setFeed] = useState(recognitionFeed);
  return (
    <>
      <h1 className="wa-h1">Recognition Centre</h1>
      <p className="wa-lede">Peer and manager shout-outs, milestones and celebrations.</p>
      <div className="wa-split">
        <div>
          {feed.map((r) => (
            <div key={r.id} className="wa-card" style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <h3>
                  {r.from} → {r.to}
                </h3>
                <span className="tag crit">Kudos</span>
              </div>
              <p style={{ margin: "8px 0", fontSize: 15, lineHeight: 1.5 }}>{r.text}</p>
              <small className="wa-sub">{r.when}</small>
            </div>
          ))}
        </div>
        <div className="wa-card">
          <h3>Recognise a colleague</h3>
          <div className="wa-field" style={{ marginTop: 12 }}>
            <textarea rows={4} value={text} onChange={(e) => setText(e.target.value)} placeholder="Say thank you…" />
          </div>
          <button
            className="wa-cta"
            disabled={!text.trim()}
            onClick={() => {
              setFeed([
                { id: crypto.randomUUID(), from: user.fullName, to: "Team", text: text.trim(), when: "Just now" },
                ...feed,
              ]);
              setText("");
              toast(dispatch, "Recognition posted");
            }}
          >
            Post recognition
          </button>
        </div>
      </div>
    </>
  );
}

/* ===================== NOTIFICATIONS / PROFILE ===================== */

export function WebNotifications() {
  const { slice, dispatch } = useHub();
  const nav = useNavigate();
  const [cat, setCat] = useState("All");
  const cats = ["All", "Announcements", "Leadership", "Approvals", "Company", "Learning", "Service Requests"];
  const items = slice.notifications.filter((n) => cat === "All" || n.category === cat);
  return (
    <>
      <h1 className="wa-h1">Notifications</h1>
      <p className="wa-lede">{slice.notifications.filter((n) => !n.read).length} unread</p>
      <div className="wa-pill-row">
        {cats.map((c) => (
          <button key={c} className={cat === c ? "wa-pill on" : "wa-pill"} onClick={() => setCat(c)}>
            {c}
          </button>
        ))}
        <span style={{ flex: 1 }} />
        <button className="wa-pill" onClick={() => dispatch({ type: "READ_ALL" })}>
          Mark all read
        </button>
      </div>
      <div className="wa-card">
        <div className="wa-list">
          {items.length === 0 && <div className="wa-empty">You are all caught up.</div>}
          {items.map((n) => (
            <button
              key={n.id}
              className="wa-row"
              onClick={() => {
                dispatch({ type: "READ_NOTIF", id: n.id });
                nav(n.to);
              }}
            >
              <span className="ico" style={{ background: n.read ? "var(--w-bg)" : "#fef2f2", color: n.read ? "#8b8b94" : "#f40009" }}>
                <Icon name="notifications" size={17} />
              </span>
              <span className="body">
                <h4 style={{ opacity: n.read ? 0.6 : 1 }}>{n.title}</h4>
                <small>
                  {n.category} · {n.body}
                </small>
              </span>
              <Icon name="chevron_right" />
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

export function WebProfile() {
  const { user, dispatch, state } = useHub();
  const nav = useNavigate();
  return (
    <>
      <h1 className="wa-h1">Employee card</h1>
      <div className="wa-split">
        <div className="wa-card">
          <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
            <img src={user.avatar} alt="" style={{ width: 84, height: 84, borderRadius: "50%", objectFit: "cover", border: "2px solid #f40009" }} />
            <div>
              <h3 style={{ fontSize: 21 }}>{user.fullName}</h3>
              <p className="wa-sub">{user.roleTitle}</p>
              <p className="wa-sub">
                {user.empId} · {user.department} · {user.location}
              </p>
              <p className="wa-sub">
                {user.email} · Manager: {user.manager}
              </p>
            </div>
          </div>
          <div className="wa-sec">
            <h2>Switch demo user</h2>
          </div>
          <div className="wa-list">
            {personas.map((p) => (
              <button
                key={p.id}
                className="wa-row"
                style={p.id === user.id ? { background: "rgba(244,0,9,0.05)" } : undefined}
                onClick={() => {
                  dispatch({ type: "LOGIN", userId: p.id });
                  toast(dispatch, `Now viewing as ${p.fullName}`);
                  nav("/");
                }}
              >
                <img src={p.avatar} alt="" style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover" }} />
                <span className="body">
                  <h4>{p.fullName}</h4>
                  <small>
                    {p.lane} · {p.roleTitle}
                  </small>
                </span>
                {p.id === user.id && <span className="tag done">Current</span>}
              </button>
            ))}
          </div>
        </div>
        <div className="wa-card">
          <h3>Preferences</h3>
          <div className="wa-field" style={{ marginTop: 12 }}>
            <label>Language</label>
            <select
              value={state.language}
              onChange={(e) => dispatch({ type: "LANG", language: e.target.value as typeof state.language })}
            >
              <option>English</option>
              <option>हिन्दी</option>
              <option>ಕನ್ನಡ</option>
            </select>
          </div>
          <button className="wa-cta ghost" onClick={() => dispatch({ type: "SET_MODE", mode: null })}>
            <Icon name="swap_horiz" size={17} /> Back to experience chooser
          </button>
          <button
            className="wa-cta ghost"
            style={{ marginTop: 10 }}
            onClick={() => {
              dispatch({ type: "LOGOUT" });
              dispatch({ type: "SET_MODE", mode: null });
            }}
          >
            Sign out
          </button>
        </div>
      </div>
    </>
  );
}

/* ===================== SEARCH / COPILOT ===================== */

const searchFacets = ["All", "Announcements", "CEO Talks", "Policies & SOPs", "News", "People", "Applications"];

export function WebSearch() {
  const [params] = useSearchParams();
  const nav = useNavigate();
  const { user, pendingCount, state, myAnnouncements } = useHub();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [facet, setFacet] = useState("All");
  const query = q.trim().toLowerCase();

  const results = useMemo(() => {
    if (!query) return [];
    const notices = myAnnouncements
      .filter((a) => `${a.title} ${a.body} ${a.owner}`.toLowerCase().includes(query))
      .map((a) => ({
        kind: "Announcements",
        title: localisedAnnouncement(a, state.language).title,
        snippet: localisedAnnouncement(a, state.language).body,
        meta: `${a.owner} · expires ${formatDay(a.expiresAt)}`,
        to: `/announcements/${a.id}`,
      }));
    const ama = seedAma
      .filter((x) => `${x.text} ${x.answer ?? ""}`.toLowerCase().includes(query) || query.includes("ceo"))
      .map((x) => ({
        kind: "CEO Talks",
        title: x.text,
        snippet: x.answer ? `${ceo.name}: ${x.answer}` : `${x.upvotes} upvotes · ${x.status}`,
        meta: x.answeredAt ?? "Open for upvotes",
        to: "/leadership",
      }));
    const docs = knowledgeDocs
      .filter((d) => `${d.title} ${d.snippet} ${d.body.join(" ")}`.toLowerCase().includes(query))
      .map((d) => ({ kind: "Policies & SOPs", title: d.title, snippet: d.snippet, meta: `${d.owner} · ${d.version}`, to: `/knowledge/${d.id}` }));
    const news = newsItems
      .filter((n) => `${n.title} ${n.body}`.toLowerCase().includes(query))
      .map((n) => ({ kind: "News", title: n.title, snippet: n.body, meta: n.time, to: `/news/${n.id}` }));
    const people = personas
      .filter((p) => `${p.fullName} ${p.roleTitle} ${p.department}`.toLowerCase().includes(query))
      .map((p) => ({ kind: "People", title: p.fullName, snippet: `${p.roleTitle} · ${p.department}`, meta: p.location, to: "/profile" }));
    const applications = apps
      .filter((a) => `${a.name} ${a.subtitle}`.toLowerCase().includes(query))
      .map((a) => ({ kind: "Applications", title: a.name, snippet: a.subtitle, meta: "Single sign-on", to: `/apps/${a.id}` }));
    const all = [...notices, ...ama, ...docs, ...news, ...people, ...applications];
    return facet === "All" ? all : all.filter((r) => r.kind === facet);
  }, [query, facet, myAnnouncements, state.language]);

  const overview = query ? copilotAnswer(q, user, pendingCount) : null;

  return (
    <>
      <h1 className="wa-h1">Search</h1>
      <div className="wa-card" style={{ padding: 14, marginBottom: 16 }}>
        <div className="wa-search" style={{ maxWidth: "none", border: 0, padding: 0 }}>
          <Icon name="search" size={20} />
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search everything you have access to" />
        </div>
      </div>
      <div className="wa-pill-row">
        {searchFacets.map((f) => (
          <button key={f} className={facet === f ? "wa-pill on" : "wa-pill"} onClick={() => setFacet(f)}>
            {f}
          </button>
        ))}
      </div>
      {query && overview && (
        <div className="wa-card" style={{ marginBottom: 16, borderLeft: "3px solid var(--brand)" }}>
          <div className="ann-meta">
            <span className="tag crit">AI OVERVIEW</span>
          </div>
          <p style={{ margin: "10px 0", fontSize: 15, lineHeight: 1.55 }}>{overview.answer}</p>
          <button className="wa-link-btn" onClick={() => nav(`/copilot?q=${encodeURIComponent(q)}`)}>
            Continue in AI Assistant →
          </button>
        </div>
      )}
      {query && results.length === 0 && <div className="wa-card wa-empty">No results. Try “leave policy” or “plant safety SOP”.</div>}
      <div className="wa-card">
        <div className="wa-list">
          {results.map((r) => (
            <button key={`${r.kind}-${r.title}`} className="wa-row" onClick={() => nav(r.to)}>
              <span className="ico" style={{ background: "var(--w-bg)" }}>
                <Icon name="find_in_page" size={17} />
              </span>
              <span className="body">
                <div className="ann-meta">
                  <span className="tag">{r.kind}</span>
                </div>
                <h4 style={{ marginTop: 4 }}>{r.title}</h4>
                <small style={{ display: "block", marginBottom: 2 }}>{r.snippet.slice(0, 150)}</small>
                <small>{r.meta}</small>
              </span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

const starters = [
  "What is my leave balance?",
  "What is the travel policy?",
  "Plant safety SOP",
  "What announcements do I have?",
  "When is the CEO AMA?",
];

export function WebCopilot() {
  const [params] = useSearchParams();
  const nav = useNavigate();
  const { slice, dispatch, user, pendingCount } = useHub();
  const [input, setInput] = useState(params.get("q") ?? "");

  const ask = (text: string) => {
    const q = text.trim();
    if (!q) return;
    const res = copilotAnswer(q, user, pendingCount);
    dispatch({ type: "COPILOT", msg: { role: "user", text: q } });
    dispatch({ type: "COPILOT", msg: { role: "assistant", text: res.answer, sources: res.sources, actions: res.actions } });
    setInput("");
  };

  return (
    <>
      <h1 className="wa-h1">AI Assistant</h1>
      <p className="wa-lede">
        Ask in plain language. Answers are grounded only in content you already have permission to
        open, and every source is cited.
      </p>
      <div className="wa-split">
        <div className="wa-card">
          {slice.copilot.length === 0 && (
            <div className="wa-empty" style={{ padding: "20px 0" }}>
              Ask about policies, balances, SOPs or announcements.
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
            {slice.copilot.map((m, i) => (
              <div
                key={i}
                style={
                  m.role === "user"
                    ? { alignSelf: "flex-end", background: "var(--brand)", color: "#fff", borderRadius: "14px 14px 4px 14px", padding: "10px 14px", maxWidth: "80%", fontSize: 14.5, lineHeight: 1.45 }
                    : { alignSelf: "flex-start", background: "var(--w-bg)", borderRadius: "14px 14px 14px 4px", padding: "12px 15px", maxWidth: "86%", fontSize: 14.5, lineHeight: 1.5 }
                }
              >
                {m.text}
                {m.sources?.map((sid) => {
                  const d = knowledgeDocs.find((x) => x.id === sid);
                  if (!d) return null;
                  return (
                    <button
                      key={sid}
                      className="wa-link-btn"
                      style={{ display: "block", marginTop: 8, fontSize: 12.5 }}
                      onClick={() => nav(`/knowledge/${sid}`)}
                    >
                      Source · {d.title} · {d.version}
                    </button>
                  );
                })}
                {m.actions?.map((a) => (
                  <button
                    key={a.to}
                    className="wa-link-btn"
                    style={{ display: "block", marginTop: 6, fontSize: 12.5 }}
                    onClick={() => nav(a.to)}
                  >
                    {a.label} →
                  </button>
                ))}
              </div>
            ))}
          </div>
          <form
            className="wa-search"
            style={{ maxWidth: "none" }}
            onSubmit={(e) => {
              e.preventDefault();
              ask(input);
            }}
          >
            <Icon name="auto_awesome" size={19} />
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask anything…" />
            <button className="wa-cta sm" type="submit">
              Ask
            </button>
          </form>
        </div>
        <div className="wa-card">
          <h3>Try asking</h3>
          <div className="wa-list">
            {starters.map((s) => (
              <button key={s} className="wa-row" onClick={() => ask(s)}>
                <span className="ico" style={{ background: "var(--w-bg)", color: "var(--brand)" }}>
                  <Icon name="auto_awesome" size={16} />
                </span>
                <span className="body">
                  <h4 style={{ fontWeight: 500 }}>{s}</h4>
                </span>
              </button>
            ))}
          </div>
          <button className="wa-cta ghost" style={{ marginTop: 12 }} onClick={() => dispatch({ type: "CLEAR_COPILOT" })}>
            New chat
          </button>
        </div>
      </div>
    </>
  );
}

/* ===================== ADMIN / HUBS ===================== */

export function WebAdmin() {
  const nav = useNavigate();
  const { state, dispatch, user } = useHub();
  if (!user.roles.includes("admin")) {
    return (
      <>
        <h1 className="wa-h1">Admin Console</h1>
        <div className="wa-card wa-empty">Admin Console is available to the corporate admin persona in this demo.</div>
      </>
    );
  }
  return (
    <>
      <h1 className="wa-h1">Admin Console</h1>
      <p className="wa-lede">
        Announcement scheduling and targeting, popup control, and the 90-day content review clock.
      </p>
      <div className="wa-sec" style={{ marginTop: 0 }}>
        <h2>Announcements & popups</h2>
        <button className="wa-link-btn" onClick={() => nav("/announcements")}>
          Preview as employee
        </button>
      </div>
      <div className="wa-card">
        <table className="wa-table">
          <thead>
            <tr>
              <th>Notice</th>
              <th>Audience</th>
              <th>Window</th>
              <th>Flags</th>
              <th>State</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {announcements.map((a) => {
              const win = announcementWindow(a, DEMO_NOW);
              const paused = state.annPaused[a.id] === true;
              return (
                <tr key={a.id}>
                  <td className="t">
                    {a.title}
                    <br />
                    <small className="wa-sub">{a.owner}</small>
                  </td>
                  <td>
                    <small className="wa-sub">{audienceLabel(a.audience)}</small>
                  </td>
                  <td>
                    <small className="wa-sub">
                      {formatDay(a.publishedAt)} → {formatDay(a.expiresAt)}
                    </small>
                  </td>
                  <td>
                    {a.popup && <span className="tag dark">Popup</span>}{" "}
                    {a.acknowledge && <span className="tag dark">Ack</span>}
                  </td>
                  <td>
                    <span className={`tag ${paused ? "" : win === "Live" ? "done" : ""}`}>{paused ? "Paused" : win}</span>
                  </td>
                  <td>
                    <button
                      className={paused ? "wa-cta sm" : "wa-cta sm ghost"}
                      onClick={() => {
                        dispatch({ type: "PAUSE_ANN", id: a.id, paused: !paused });
                        toast(dispatch, paused ? "Published" : "Paused");
                      }}
                    >
                      {paused ? "Publish" : "Pause"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="wa-sec">
        <h2>Content governance</h2>
        <span className="wa-sub">Named owner · 90-day review clock</span>
      </div>
      <div className="wa-grid wa-g2">
        {governanceItems.map((g) => {
          const status = state.governance[g.id] ?? (g.health === "Overdue" ? "In review" : "Published");
          return (
            <div key={g.id} className="wa-card">
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <h3>{g.title}</h3>
                <span className={`tag ${g.health === "Overdue" ? "crit" : g.health === "Due soon" ? "high" : "done"}`}>
                  {g.health}
                </span>
              </div>
              <p className="wa-sub" style={{ marginBottom: 12 }}>
                Owner {g.owner} · review due {g.due} · status {status}
              </p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button className="wa-cta sm" onClick={() => dispatch({ type: "GOV", id: g.id, status: "Published" })}>
                  Confirm
                </button>
                <button className="wa-cta sm ghost" onClick={() => dispatch({ type: "GOV", id: g.id, status: "Archived" })}>
                  Archive
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

const hubMap = {
  sales: {
    title: "Sales Hub",
    lede: "Playbooks, territory analytics and the distributor stack for commercial teams.",
    owner: "Sales Excellence",
    items: [
      ["Q3 Sales Playbook", "/knowledge/playbook-q3", "menu_book"],
      ["Territory analytics", "/analytics", "monitoring"],
      ["Sales CRM", "/apps/crm", "storefront"],
      ["Distributor Management", "/apps/dms", "local_shipping"],
    ],
  },
  mfg: {
    title: "Manufacturing Hub",
    lede: "Plant SOPs, safety notices and line productivity for the factory network.",
    owner: "Operations",
    items: [
      ["Plant Safety SOP", "/knowledge/sop-plant-safety", "health_and_safety"],
      ["Plant news", "/news/n3", "newspaper"],
      ["Line productivity", "/analytics", "monitoring"],
      ["Raise a plant ticket", "/services/it", "build"],
    ],
  },
  sc: {
    title: "Supply Chain Hub",
    lede: "Warehouse procedures, ERP access and network learning across 32 warehouses.",
    owner: "Integrated Supply Chain",
    items: [
      ["Warehouse Handling SOP", "/knowledge/sop-warehouse", "inventory_2"],
      ["SAP ERP", "/apps/sap", "database"],
      ["Distributor Management", "/apps/dms", "local_shipping"],
      ["Training", "/learning", "school"],
    ],
  },
  apps: {
    title: "Business applications",
    lede: "One launch point for every system — single sign-on, no second login.",
    owner: "IT Team",
    items: [] as string[][],
  },
} as const;

export function WebHubPage({ kind }: { kind: "sales" | "mfg" | "sc" | "apps" }) {
  const nav = useNavigate();
  const { slice, dispatch } = useHub();
  const h = hubMap[kind];

  if (kind === "apps") {
    return (
      <>
        <h1 className="wa-h1">{h.title}</h1>
        <p className="wa-lede">{h.lede}</p>
        <div className="wa-grid wa-g4">
          {apps.map((a) => (
            <div key={a.id} className="wa-card" style={{ textAlign: "center" }}>
              <span className="sys-mark" style={{ background: a.color, color: a.accent, margin: "0 auto 10px" }}>
                {a.initials}
              </span>
              <h3>{a.name}</h3>
              <p className="wa-sub" style={{ marginBottom: 12 }}>{a.subtitle}</p>
              <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                <button className="wa-cta sm" onClick={() => toast(dispatch, `${a.name} opened with SSO`)}>
                  Open
                </button>
                <button className="wa-cta sm ghost" onClick={() => dispatch({ type: "TOGGLE_FAV", id: a.id })}>
                  <Icon name="star" fill={slice.favApps.includes(a.id)} size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <h1 className="wa-h1">{h.title}</h1>
      <p className="wa-lede">
        {h.lede} Owned by {h.owner}.
      </p>
      <div className="wa-split">
        <div className="wa-grid wa-g2">
          {h.items.map(([label, to, icon]) => (
            <button key={label} className="wa-card" style={{ textAlign: "left" }} onClick={() => nav(to)}>
              <span className="ico" style={{ background: "#fef2f2", color: "#f40009", width: 36, height: 36, borderRadius: 10, display: "grid", placeItems: "center" }}>
                <Icon name={icon} size={19} />
              </span>
              <h3 style={{ marginTop: 12 }}>{label}</h3>
            </button>
          ))}
        </div>
        <div className="wa-card">
          <h3>Hub metrics</h3>
          <p className="wa-sub" style={{ marginBottom: 12 }}>Live from Power BI</p>
          <div className="wa-list">
            {analyticsCards.map((c) => (
              <div key={c.id} className="wa-row" style={{ cursor: "default" }}>
                <span className="body">
                  <small>{c.hint}</small>
                  <h4>{c.title}</h4>
                </span>
                <b style={{ fontSize: 20, letterSpacing: "-0.03em", color: c.tone === "good" ? "#1a7f37" : c.tone === "bad" ? "#f40009" : "#a1620a" }}>
                  {c.value}
                </b>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
