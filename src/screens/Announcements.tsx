import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Icon, ScreenHeader } from "../ui";
import {
  announcementWindow,
  announcements,
  audienceLabel,
  audienceMatch,
  DEMO_NOW,
  formatDay,
  localisedAnnouncement,
  matchReasons,
  personalFeed,
  sortAnnouncements,
  type Announcement,
  type AnnouncementKind,
} from "../data";
import { toast, useHub } from "../store";

const kindIcon: Record<AnnouncementKind, { icon: string; bg: string; color: string }> = {
  Mandatory: { icon: "priority_high", bg: "#fef2f2", color: "#f40009" },
  Policy: { icon: "gavel", bg: "#eff6ff", color: "#2563eb" },
  HR: { icon: "badge", bg: "#f5f3ff", color: "#7c3aed" },
  Event: { icon: "event", bg: "#fffbeb", color: "#d97706" },
  Campaign: { icon: "campaign", bg: "#ecfdf5", color: "#059669" },
  Announcement: { icon: "notifications_active", bg: "#f1f5f9", color: "#0f172a" },
};

function priorityTag(p: Announcement["priority"]) {
  return p === "Critical" ? "crit" : p === "High" ? "high" : "";
}

/* ------------------------------------------------------------------ *
 * 1. Personalised announcement — Home hero carousel.
 *    Cards are generated from the signed-in persona (lane, department,
 *    location, live balances) and carry the targeting reason.
 * ------------------------------------------------------------------ */
export function PersonalAnnouncement() {
  const nav = useNavigate();
  const { user, slice, pendingCount, myAnnouncements } = useHub();
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const cards = useMemo(
    () =>
      personalFeed(user, {
        pending: pendingCount,
        openTickets: slice.tickets.filter((t) => t.status !== "Resolved").length,
        leaveDays: user.leaveDays,
        training: user.training,
      }),
    [user, pendingCount, slice.tickets]
  );

  // Auto-advance the banner carousel (Proposed features: rotating banners).
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const t = window.setInterval(() => {
      const next = (Math.round(el.scrollLeft / el.clientWidth) + 1) % cards.length;
      el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
    }, 7000);
    return () => window.clearInterval(t);
  }, [cards.length]);

  return (
    <section data-hint="home-personal">
      <div className="section-title" style={{ marginTop: 16 }}>
        <h3>For {user.firstName}</h3>
        <span className="tiny">
          {myAnnouncements.length} targeted to {user.location.split(" · ")[0]}
        </span>
      </div>
      <div
        className="pa-track"
        ref={trackRef}
        onScroll={(e) => {
          const el = e.currentTarget;
          setIndex(Math.round(el.scrollLeft / el.clientWidth));
        }}
      >
        {cards.map((c) => (
          <article key={c.id} className={`pa-card ${c.tone}`}>
            <div className="pa-eyebrow">{c.eyebrow}</div>
            <h3>{c.title}</h3>
            <p>{c.body}</p>
            <div className="pa-why">
              {c.reasons.map((r) => (
                <span key={r}>{r}</span>
              ))}
            </div>
            <div className="pa-foot">
              {c.stat ? (
                <div className="pa-stat">
                  <b>{c.stat.value}</b>
                  <span>{c.stat.label}</span>
                </div>
              ) : (
                <span />
              )}
              <button className="pa-go" onClick={() => nav(c.cta.to)}>
                {c.cta.label} <Icon name="arrow_forward" size={16} />
              </button>
            </div>
          </article>
        ))}
      </div>
      <div className="pa-dots">
        {cards.map((c, i) => (
          <i key={c.id} className={i === index ? "on" : ""} />
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * 2. Important announcements — Home section.
 * ------------------------------------------------------------------ */
export function ImportantAnnouncements({ limit = 3 }: { limit?: number }) {
  const nav = useNavigate();
  const { myAnnouncements, needsAck, slice, dispatch, state } = useHub();
  const list = myAnnouncements.slice(0, limit);

  if (!list.length) {
    return (
      <>
        <div className="section-title">
          <h3>Important Announcements</h3>
        </div>
        <div className="card muted">Nothing needs your attention right now.</div>
      </>
    );
  }

  return (
    <>
      <div className="section-title">
        <h3>Important Announcements</h3>
        <button className="link" data-hint="home-ann-all" onClick={() => nav("/announcements")}>
          View All
        </button>
      </div>
      {needsAck.length > 0 && (
        <p className="tiny" style={{ margin: "0 4px 8px", color: "var(--brand)", fontWeight: 600 }}>
          {needsAck.length} notice{needsAck.length > 1 ? "s" : ""}{" "}
          {needsAck.length > 1 ? "need" : "needs"} your acknowledgement
        </p>
      )}
      {list.map((a) => (
        <AnnouncementRow
          key={a.id}
          item={a}
          language={state.language}
          acked={slice.annAck.includes(a.id)}
          onOpen={() => nav(`/announcements/${a.id}`)}
          onAck={() => {
            dispatch({ type: "ACK_ANN", id: a.id });
            toast(dispatch, "Acknowledgement recorded");
          }}
          onDismiss={() => dispatch({ type: "DISMISS_ANN", id: a.id })}
        />
      ))}
    </>
  );
}

function AnnouncementRow({
  item,
  language,
  acked,
  onOpen,
  onAck,
  onDismiss,
}: {
  item: Announcement;
  language: string;
  acked: boolean;
  onOpen: () => void;
  onAck: () => void;
  onDismiss: () => void;
}) {
  const t = localisedAnnouncement(item, language);
  const look = kindIcon[item.kind];
  return (
    <div className={`ann-row p-${item.priority.toLowerCase()}`} data-hint="home-ann-row">
      <div className="ann-ico" style={{ background: look.bg, color: look.color }}>
        <Icon name={look.icon} size={19} />
      </div>
      <div className="ann-body">
        <div className="ann-meta">
          <span className={`tag ${priorityTag(item.priority)}`}>{item.priority}</span>
          <span className="tag">{item.kind}</span>
          {acked && <span className="tag done">Acknowledged</span>}
        </div>
        <h4>{t.title}</h4>
        <div className="tiny">
          {item.owner} · expires {formatDay(item.expiresAt)}
        </div>
        <div className="ann-actions">
          <button className="mini" onClick={onOpen}>
            Read
          </button>
          {item.acknowledge &&
            (acked ? (
              <span className="mini done">Acknowledged</span>
            ) : (
              <button className="mini solid" data-hint="home-ann-ack" onClick={onAck}>
                Acknowledge
              </button>
            ))}
        </div>
      </div>
      {!item.acknowledge && (
        <button className="ann-x" aria-label="Dismiss" onClick={onDismiss}>
          <Icon name="close" size={18} />
        </button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * 3. Popup engine — scheduled, targeted, one-shot per employee.
 * ------------------------------------------------------------------ */
export function AnnouncementPopup() {
  const nav = useNavigate();
  const { popupAnnouncement, dispatch, state, user } = useHub();
  if (!popupAnnouncement) return null;
  const a = popupAnnouncement;
  const t = localisedAnnouncement(a, state.language);
  const look = kindIcon[a.kind];
  const close = () => dispatch({ type: "SEEN_ANN", id: a.id });

  return (
    <div className="popup-scrim" role="dialog" aria-modal="true" aria-label={t.title}>
      <div className="popup-card">
        {a.media && <img src={a.media} alt="" />}
        <div className="popup-body">
          <div className="between">
            <div className="ann-meta">
              <span className={`tag ${priorityTag(a.priority)}`}>{a.priority}</span>
              <span className="tag">{a.kind}</span>
            </div>
            <button className="ann-x" aria-label="Close" onClick={close}>
              <Icon name="close" size={20} />
            </button>
          </div>
          <h3>{t.title}</h3>
          <p>{t.body}</p>
          <div className="ann-meta" style={{ marginBottom: 10 }}>
            {matchReasons(a.audience, user).map((r) => (
              <span key={r} className="tag">
                {r}
              </span>
            ))}
          </div>
          <div className="tiny" style={{ marginBottom: 4 }}>
            {a.owner} · live {formatDay(a.publishedAt)}–{formatDay(a.expiresAt)}
          </div>
          {a.acknowledge ? (
            <button
              className="cta"
              data-hint="popup-ack"
              onClick={() => {
                dispatch({ type: "ACK_ANN", id: a.id });
                toast(dispatch, "Acknowledgement recorded");
              }}
            >
              I acknowledge this notice
            </button>
          ) : (
            <button className="cta" onClick={close}>
              Got it
            </button>
          )}
          {a.cta && (
            <button
              className="cta ghost"
              onClick={() => {
                close();
                nav(a.cta!.to);
              }}
            >
              {a.cta.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * 4. Full announcement centre.
 * ------------------------------------------------------------------ */
const kinds = ["All", "Mandatory", "Policy", "HR", "Event", "Campaign"] as const;

export function Announcements() {
  const nav = useNavigate();
  const { user, slice, dispatch, state, myAnnouncements, needsAck } = useHub();
  const [kind, setKind] = useState<(typeof kinds)[number]>("All");

  const live = kind === "All" ? myAnnouncements : myAnnouncements.filter((a) => a.kind === kind);
  const archive = useMemo(
    () =>
      sortAnnouncements(
        announcements.filter(
          (a) =>
            audienceMatch(a.audience, user) &&
            (announcementWindow(a, DEMO_NOW) === "Expired" || slice.annDismissed.includes(a.id))
        )
      ),
    [user, slice.annDismissed]
  );

  return (
    <>
      <ScreenHeader title="Announcements" />
      <div className="scroll">
        <h1 className="h1" style={{ fontSize: 24 }}>
          Important Announcements
        </h1>
        <p className="muted" style={{ marginBottom: 12 }}>
          Targeted to {user.department} · {user.location}. {needsAck.length} awaiting acknowledgement.
        </p>
        <div className="filters">
          {kinds.map((k) => (
            <button key={k} className={kind === k ? "filter on" : "filter"} onClick={() => setKind(k)}>
              {k}
            </button>
          ))}
        </div>
        {live.length === 0 && <div className="card muted">No {kind.toLowerCase()} announcements are live for you.</div>}
        {live.map((a) => (
          <AnnouncementRow
            key={a.id}
            item={a}
            language={state.language}
            acked={slice.annAck.includes(a.id)}
            onOpen={() => nav(`/announcements/${a.id}`)}
            onAck={() => {
              dispatch({ type: "ACK_ANN", id: a.id });
              toast(dispatch, "Acknowledgement recorded");
            }}
            onDismiss={() => dispatch({ type: "DISMISS_ANN", id: a.id })}
          />
        ))}
        {archive.length > 0 && (
          <>
            <div className="section-title">
              <h3>Archive</h3>
              <span className="tiny">Expired or dismissed</span>
            </div>
            {archive.map((a) => (
              <button key={a.id} className="list-item" onClick={() => nav(`/announcements/${a.id}`)}>
                <Icon name="inventory_2" />
                <div style={{ flex: 1, textAlign: "left" }}>
                  <h4 style={{ fontSize: 15, opacity: 0.7 }}>{localisedAnnouncement(a, state.language).title}</h4>
                  <div className="tiny">
                    {announcementWindow(a, DEMO_NOW) === "Expired" ? "Expired" : "Dismissed"} ·{" "}
                    {formatDay(a.expiresAt)}
                  </div>
                </div>
              </button>
            ))}
          </>
        )}
      </div>
    </>
  );
}

export function AnnouncementDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const { slice, dispatch, state, user } = useHub();
  const item = announcements.find((a) => a.id === id);
  if (!item) return null;
  const t = localisedAnnouncement(item, state.language);
  const look = kindIcon[item.kind];
  const acked = slice.annAck.includes(item.id);
  const window_ = announcementWindow(item, DEMO_NOW);

  return (
    <>
      <ScreenHeader title={item.kind} />
      <div className="scroll">
        {item.media && (
          <img
            src={item.media}
            alt=""
            style={{ width: "100%", height: 150, objectFit: "cover", borderRadius: 14, marginBottom: 12 }}
          />
        )}
        <div className="ann-meta">
          <span className={`tag ${priorityTag(item.priority)}`}>{item.priority}</span>
          <span className="tag">{item.kind}</span>
          <span className={`tag ${window_ === "Live" ? "done" : ""}`}>{window_}</span>
          {acked && <span className="tag done">Acknowledged</span>}
        </div>
        <h1 className="h1" style={{ fontSize: 24, margin: "10px 0 6px" }}>
          {t.title}
        </h1>
        <p className="tiny">
          {item.owner} · published {formatDay(item.publishedAt)} · expires {formatDay(item.expiresAt)}
        </p>
        <p style={{ lineHeight: 1.55, fontSize: 16 }}>{t.body}</p>
        <div className="card" style={{ marginTop: 4 }}>
          <div className="tiny">DETAIL</div>
          {item.detail.map((d) => (
            <div key={d} className="row" style={{ marginTop: 8, alignItems: "flex-start" }}>
              <div className="ann-ico" style={{ background: look.bg, color: look.color, width: 24, height: 24, borderRadius: 7 }}>
                <Icon name="check" size={14} />
              </div>
              <span style={{ fontSize: 15, letterSpacing: "-0.016em" }}>{d}</span>
            </div>
          ))}
        </div>
        <div className="card" style={{ marginTop: 10 }}>
          <div className="tiny">AUDIENCE</div>
          <h4 style={{ margin: "4px 0 8px" }}>{audienceLabel(item.audience)}</h4>
          <div className="ann-meta">
            {matchReasons(item.audience, user).map((r) => (
              <span key={r} className="tag">
                {r}
              </span>
            ))}
          </div>
          <p className="tiny" style={{ marginTop: 8 }}>
            You are seeing this because your profile matches the targeting rules for this notice.
          </p>
        </div>
        {item.acknowledge &&
          (acked ? (
            <button className="cta ghost" disabled>
              Acknowledged
            </button>
          ) : (
            <button
              className="cta"
              data-hint="ann-ack"
              onClick={() => {
                dispatch({ type: "ACK_ANN", id: item.id });
                toast(dispatch, "Acknowledgement recorded");
              }}
            >
              I acknowledge this notice
            </button>
          ))}
        {item.cta && (
          <button className="cta ghost" onClick={() => nav(item.cta!.to)}>
            {item.cta.label}
          </button>
        )}
      </div>
    </>
  );
}
