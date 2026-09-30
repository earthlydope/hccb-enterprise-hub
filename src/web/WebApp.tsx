import { useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Icon } from "../ui";
import { toast, useHub } from "../store";
import { isAdmin } from "../personas";
import { localisedAnnouncement, matchReasons, formatDay } from "../data";
import { WebHintStage } from "./guide";
import { WebHome } from "./Home";
import { WebAnalytics } from "./Analytics";
import {
  WebAnnouncementDetail,
  WebAnnouncements,
  WebCommunities,
  WebCopilot,
  WebHubPage,
  WebKnowledge,
  WebKnowledgeDetail,
  WebLeadership,
  WebLearning,
  WebNews,
  WebNewsDetail,
  WebNotifications,
  WebProfile,
  WebRecognition,
  WebSearch,
  WebServices,
  WebWorkspace,
  WebAdmin,
} from "./Pages";

type NavItem = { to: string; label: string; icon: string; badge?: number };

function useNavModel(): { group: string; items: NavItem[] }[] {
  const { pendingCount, unread, user, needsAck } = useHub();
  return [
    {
      group: "For you",
      items: [
        { to: "/", label: "Home", icon: "home" },
        { to: "/workspace", label: "My Workspace", icon: "business_center", badge: pendingCount || undefined },
        { to: "/notifications", label: "Notifications", icon: "notifications", badge: unread || undefined },
      ],
    },
    {
      group: "Communications",
      items: [
        { to: "/news", label: "Company News", icon: "newspaper" },
        { to: "/leadership", label: "Leadership Corner", icon: "record_voice_over" },
        { to: "/announcements", label: "Announcements", icon: "campaign", badge: needsAck.length || undefined },
        { to: "/recognition", label: "Recognition Centre", icon: "emoji_events" },
        { to: "/communities", label: "Employee Communities", icon: "groups" },
      ],
    },
    {
      group: "Services",
      items: [
        { to: "/services", label: "HR Services", icon: "badge" },
        { to: "/services/it", label: "IT Support", icon: "support_agent" },
        { to: "/learning", label: "Learning Hub", icon: "school" },
      ],
    },
    {
      group: "Function hubs",
      items: [
        { to: "/sales", label: "Sales Hub", icon: "storefront" },
        { to: "/manufacturing", label: "Manufacturing Hub", icon: "factory" },
        { to: "/supply-chain", label: "Supply Chain Hub", icon: "local_shipping" },
      ],
    },
    {
      group: "Knowledge & intelligence",
      items: [
        { to: "/knowledge", label: "Policies & SOPs", icon: "menu_book" },
        { to: "/copilot", label: "AI Assistant", icon: "auto_awesome" },
        { to: "/analytics", label: "Analytics Dashboard", icon: "monitoring" },
        ...(isAdmin(user) ? [{ to: "/admin", label: "Admin Console", icon: "admin_panel_settings" }] : []),
      ],
    },
  ];
}

function Sidebar() {
  const nav = useNavigate();
  const loc = useLocation();
  const { dispatch } = useHub();
  const model = useNavModel();

  const active = (to: string) =>
    to === "/" ? loc.pathname === "/" : loc.pathname === to || loc.pathname.startsWith(to + "/");

  return (
    <aside className="wa-side">
      <div className="wa-logo">
        <img src="/coca-cola.svg" alt="Coca-Cola" />
        <div>
          <b>Experience Hub</b>
          <small>Hindustan Coca-Cola Beverages</small>
        </div>
      </div>
      <nav className="wa-nav" data-hint="w-nav">
        {model.map((g) => (
          <div key={g.group}>
            <div className="wa-group">{g.group}</div>
            {g.items.map((it) => (
              <button
                key={it.to}
                className={active(it.to) ? "wa-link on" : "wa-link"}
                onClick={() => nav(it.to)}
              >
                <Icon name={it.icon} fill={active(it.to)} />
                {it.label}
                {it.badge ? <span className="wa-count">{it.badge}</span> : null}
              </button>
            ))}
          </div>
        ))}
      </nav>
      <div className="wa-side-foot">
        <button
          className="wa-switch"
          data-hint="w-switch"
          onClick={() => {
            dispatch({ type: "SET_MODE", mode: "mobile" });
            nav("/");
          }}
        >
          <Icon name="smartphone" />
          Switch to mobile app
        </button>
      </div>
    </aside>
  );
}

function TopBar() {
  const nav = useNavigate();
  const { unread, user, state, dispatch } = useHub();
  const [q, setQ] = useState("");
  return (
    <header className="wa-top">
      <form
        className="wa-search"
        data-hint="w-search"
        onSubmit={(e) => {
          e.preventDefault();
          if (q.trim()) nav(`/search?q=${encodeURIComponent(q.trim())}`);
        }}
      >
        <Icon name="search" size={19} />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ask in plain language — “leave policy”, “plant safety SOP”…"
        />
        <kbd>⌘K</kbd>
      </form>
      <div className="wa-top-right">
        <select
          className="wa-lang"
          data-hint="w-lang"
          value={state.language}
          aria-label="Language"
          onChange={(e) => dispatch({ type: "LANG", language: e.target.value as typeof state.language })}
        >
          <option>English</option>
          <option>हिन्दी</option>
          <option>ಕನ್ನಡ</option>
        </select>
        <button className="wa-icon" aria-label="AI Assistant" onClick={() => nav("/copilot")}>
          <Icon name="auto_awesome" size={19} />
        </button>
        <button className="wa-icon" data-hint="w-alerts" aria-label="Notifications" onClick={() => nav("/notifications")}>
          <Icon name="notifications" size={19} />
          {unread > 0 && <span className="badge">{unread}</span>}
        </button>
        <button className="wa-me" data-hint="w-me" onClick={() => nav("/profile")}>
          <img src={user.avatar} alt="" />
          <span>
            <b>{user.fullName}</b>
            <small>{user.location}</small>
          </span>
        </button>
      </div>
    </header>
  );
}

/** Same scheduled/targeted popup engine as mobile, in a desktop modal. */
function WebPopup() {
  const nav = useNavigate();
  const { popupAnnouncement, dispatch, state, user } = useHub();
  if (!popupAnnouncement) return null;
  const a = popupAnnouncement;
  const t = localisedAnnouncement(a, state.language);
  const close = () => dispatch({ type: "SEEN_ANN", id: a.id });
  return (
    <div className="wa-scrim" role="dialog" aria-modal="true" aria-label={t.title}>
      <div className="wa-modal">
        {a.media && <img src={a.media} alt="" />}
        <div className="wa-modal-b">
          <div className="ann-meta">
            <span className={`tag ${a.priority === "Critical" ? "crit" : a.priority === "High" ? "high" : ""}`}>
              {a.priority}
            </span>
            <span className="tag">{a.kind}</span>
            {matchReasons(a.audience, user).map((r) => (
              <span key={r} className="tag">
                {r}
              </span>
            ))}
          </div>
          <h3>{t.title}</h3>
          <p>{t.body}</p>
          <p className="wa-sub" style={{ marginBottom: 16 }}>
            {a.owner} · live {formatDay(a.publishedAt)}–{formatDay(a.expiresAt)}
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {a.acknowledge ? (
              <button
                className="wa-cta"
                onClick={() => {
                  dispatch({ type: "ACK_ANN", id: a.id });
                  toast(dispatch, "Acknowledgement recorded");
                }}
              >
                I acknowledge this notice
              </button>
            ) : (
              <button className="wa-cta" onClick={close}>
                Got it
              </button>
            )}
            {a.cta && (
              <button
                className="wa-cta ghost"
                onClick={() => {
                  close();
                  nav(a.cta!.to);
                }}
              >
                {a.cta.label}
              </button>
            )}
            {a.acknowledge && (
              <button className="wa-cta ghost" onClick={close}>
                Later
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function WebToasts() {
  const { state } = useHub();
  if (!state.toasts.length) return null;
  return (
    <div className="wa-toasts">
      {state.toasts.map((t) => (
        <div key={t.id} className="wa-toast">
          {t.text}
        </div>
      ))}
    </div>
  );
}

export function WebApp() {
  return (
    <WebHintStage>
      <div className="wa">
      <Sidebar />
      <div className="wa-main">
        <TopBar />
        <div className="wa-body">
          <Routes>
            <Route path="/" element={<WebHome />} />
            <Route path="/workspace" element={<WebWorkspace />} />
            <Route path="/workspace/*" element={<WebWorkspace />} />
            <Route path="/approvals/:id" element={<WebWorkspace />} />
            <Route path="/services" element={<WebServices />} />
            <Route path="/services/*" element={<WebServices />} />
            <Route path="/news" element={<WebNews />} />
            <Route path="/news/:id" element={<WebNewsDetail />} />
            <Route path="/leadership" element={<WebLeadership />} />
            <Route path="/ceo-talks" element={<WebLeadership />} />
            <Route path="/announcements" element={<WebAnnouncements />} />
            <Route path="/announcements/:id" element={<WebAnnouncementDetail />} />
            <Route path="/recognition" element={<WebRecognition />} />
            <Route path="/communities" element={<WebCommunities />} />
            <Route path="/learning" element={<WebLearning />} />
            <Route path="/knowledge" element={<WebKnowledge />} />
            <Route path="/knowledge/:id" element={<WebKnowledgeDetail />} />
            <Route path="/copilot" element={<WebCopilot />} />
            <Route path="/analytics" element={<WebAnalytics />} />
            <Route path="/search" element={<WebSearch />} />
            <Route path="/notifications" element={<WebNotifications />} />
            <Route path="/profile" element={<WebProfile />} />
            <Route path="/admin" element={<WebAdmin />} />
            <Route path="/apps" element={<WebHubPage kind="apps" />} />
            <Route path="/apps/:id" element={<WebHubPage kind="apps" />} />
            <Route path="/sales" element={<WebHubPage kind="sales" />} />
            <Route path="/manufacturing" element={<WebHubPage kind="mfg" />} />
            <Route path="/supply-chain" element={<WebHubPage kind="sc" />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
        <WebPopup />
        <WebToasts />
      </div>
    </WebHintStage>
  );
}
