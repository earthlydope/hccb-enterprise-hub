import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Icon, ScreenHeader, TopBar } from "../ui";
import { analyticsCards, apps, communities, governanceItems, learningCourses, newsItems, recognitionFeed } from "../data";
import { toast, useHub } from "../store";
import { personas } from "../personas";

export function Profile() {
  const { dispatch, user, state } = useHub();
  const nav = useNavigate();
  const isAdmin = user.roles.includes("admin");
  return (
    <>
      <ScreenHeader title="Employee Card" />
      <div className="scroll">
        <div className="card" style={{ textAlign: "center" }}>
          <img className="avatar" src={user.avatar} alt="" style={{ width: 84, height: 84, border: "2px solid #f40009" }} />
          <h2 className="h2">{user.fullName}</h2>
          <p className="tiny">
            Emp ID: {user.empId} · {user.lane}
          </p>
          <p className="muted">
            {user.roleTitle}
          </p>
          <p className="tiny">{user.department} · {user.location}</p>
          <p className="tiny">Manager: {user.manager}</p>
          <p className="tiny">{user.email}</p>
          {isAdmin && (
            <button className="cta small" style={{ margin: "12px auto 0" }} onClick={() => nav("/admin")}>
              Admin Console
            </button>
          )}
        </div>
        <div className="section-title">
          <h3>Switch demo user</h3>
        </div>
        {personas.map((p) => (
          <button
            key={p.id}
            className={p.id === user.id ? "list-item current-user" : "list-item"}
            onClick={() => {
              dispatch({ type: "LOGIN", userId: p.id });
              toast(dispatch, `Now viewing as ${p.fullName}`);
              nav("/");
            }}
          >
            <img className="avatar" src={p.avatar} alt="" />
            <div>
              <h4>{p.fullName}</h4>
              <div className="tiny">{p.lane} · {p.roleTitle}</div>
            </div>
          </button>
        ))}
        <div className="section-title">
          <h3>More</h3>
        </div>
        <button className="list-item" onClick={() => nav("/communities")}>
          <Icon name="groups" />
          <div>
            <h4>Communities</h4>
            <div className="tiny">Plant, support desk, run club</div>
          </div>
        </button>
        <button className="list-item" onClick={() => nav("/recognition")}>
          <Icon name="emoji_events" />
          <div>
            <h4>Recognition</h4>
            <div className="tiny">Peer shout-outs</div>
          </div>
        </button>
        <button className="list-item" onClick={() => nav("/learning")}>
          <Icon name="school" />
          <div>
            <h4>Learning</h4>
            <div className="tiny">{user.training}% complete</div>
          </div>
        </button>
        <button className="list-item" onClick={() => nav("/analytics")}>
          <Icon name="monitoring" />
          <div>
            <h4>Analytics</h4>
            <div className="tiny">Volume, OEE, tickets</div>
          </div>
        </button>
        <div className="field" style={{ marginTop: 14 }}>
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
        <button className="list-item" onClick={() => toast(dispatch, "Notification prefs saved", "info")}>
          <Icon name="notifications" />
          <div>
            <h4>Notification preferences</h4>
            <div className="tiny">Approvals, learning, communities</div>
          </div>
        </button>
        <button
          className="cta ghost"
          onClick={() => {
            dispatch({ type: "LOGOUT" });
            nav("/login");
          }}
        >
          Sign out
        </button>
      </div>
    </>
  );
}

export function Notifications() {
  const { slice, dispatch } = useHub();
  const nav = useNavigate();
  const [cat, setCat] = useState("All");
  const cats = ["All", "Approvals", "Company", "Learning", "Recognition", "Service Requests"];
  const items = slice.notifications.filter((n) => cat === "All" || n.category === cat);
  return (
    <>
      <ScreenHeader title="Notifications" />
      <div className="scroll">
        <div className="between">
          <span className="tiny">{slice.notifications.filter((n) => !n.read).length} unread</span>
          <button className="link" onClick={() => dispatch({ type: "READ_ALL" })}>
            Mark all read
          </button>
        </div>
        <div className="filters">
          {cats.map((c) => (
            <button key={c} className={cat === c ? "filter on" : "filter"} onClick={() => setCat(c)}>
              {c}
            </button>
          ))}
        </div>
        {items.length === 0 && <div className="card muted">You are all caught up.</div>}
        {items.map((n) => (
          <div key={n.id} className="list-item">
            <button
              style={{ flex: 1, textAlign: "left", border: 0, background: "transparent" }}
              onClick={() => {
                dispatch({ type: "READ_NOTIF", id: n.id });
                nav(n.to);
              }}
            >
              <h4 style={{ opacity: n.read ? 0.65 : 1 }}>{n.title}</h4>
              <div className="tiny">
                {n.category} · {n.body}
              </div>
            </button>
            <button className="icon-btn" onClick={() => dispatch({ type: "DISMISS_NOTIF", id: n.id })}>
              <Icon name="close" size={18} />
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

export function Apps() {
  const nav = useNavigate();
  const { slice, dispatch } = useHub();
  const [q, setQ] = useState("");
  const list = apps.filter((a) => a.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <ScreenHeader title="All Tools" />
      <div className="scroll">
        <div className="searchbar">
          <Icon name="search" size={18} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search apps" />
        </div>
        <div className="list" style={{ marginTop: 12 }}>
          {list.map((a) => (
            <button key={a.id} className="list-item" onClick={() => nav(`/apps/${a.id}`)}>
              <div className="sys-mark" style={{ background: a.color, color: a.accent }}>
                {a.initials}
              </div>
              <div style={{ flex: 1, textAlign: "left" }}>
                <h4>{a.name}</h4>
                <div className="tiny">{a.subtitle}</div>
              </div>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch({ type: "TOGGLE_FAV", id: a.id });
                }}
              >
                <Icon name="star" fill={slice.favApps.includes(a.id)} />
              </span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

export function AppLaunch() {
  const { id } = useParams();
  const app = apps.find((a) => a.id === id);
  const nav = useNavigate();
  const { dispatch } = useHub();
  if (!app) return null;
  return (
    <>
      <ScreenHeader title={app.name} />
      <div className="scroll">
        <div className="card">
          <div className="sys-mark" style={{ background: app.color, color: app.accent, marginBottom: 10 }}>
            {app.initials}
          </div>
          <h2 className="h2">{app.name}</h2>
          <p className="muted">{app.subtitle}</p>
          <p>SSO session is simulated. You stay inside HCCB Hub with a read-only snapshot.</p>
        </div>
        <div className="card" style={{ marginTop: 10 }}>
          <div className="tiny">LIVE SNAPSHOT</div>
          <h4 style={{ margin: "6px 0" }}>{app.name} · South Zone</h4>
          <p className="tiny">Last sync just now · Connected as your HCCB identity</p>
          <div className="stats" style={{ marginTop: 8 }}>
            <div className="stat">
              <span>Status</span>
              <b className="good">Online</b>
            </div>
            <div className="stat">
              <span>Queue</span>
              <b>3</b>
            </div>
          </div>
        </div>
        <button
          className="cta"
          onClick={() => toast(dispatch, `${app.name} session kept in Hub`, "info")}
        >
          Working in {app.name}
        </button>
        <button className="cta ghost" onClick={() => nav("/apps")}>
          Back to all tools
        </button>
      </div>
    </>
  );
}

export function News() {
  const nav = useNavigate();
  return (
    <>
      <TopBar title="News" />
      <div className="scroll">
        <h1 className="h1">Company News</h1>
        {newsItems.map((n) => (
          <button key={n.id} className="list-item" onClick={() => nav(`/news/${n.id}`)}>
            <Icon name="newspaper" />
            <div style={{ textAlign: "left" }}>
              <h4>{n.title}</h4>
              <div className="tiny">
                {n.category} · {n.read} · {n.time}
              </div>
            </div>
          </button>
        ))}
        <button className="list-item" onClick={() => nav("/recognition")}>
          <Icon name="emoji_events" />
          <div>
            <h4>Recognition Center</h4>
            <div className="tiny">Peer and manager shout-outs</div>
          </div>
        </button>
      </div>
    </>
  );
}

export function NewsDetail() {
  const { id } = useParams();
  const item = newsItems.find((n) => n.id === id);
  const { dispatch, slice } = useHub();
  if (!item) return null;
  const read = slice.newsRead.includes(item.id);
  return (
    <>
      <ScreenHeader title={item.category} />
      <div className="scroll">
        <h1 className="h1" style={{ fontSize: 24 }}>
          {item.title}
        </h1>
        <p className="tiny">
          {item.read} · {item.time}
        </p>
        <p style={{ lineHeight: 1.55 }}>{item.body}</p>
        <button
          className="cta ghost"
          onClick={() => {
            dispatch({ type: "READ_NEWS", id: item.id });
          }}
        >
          {read ? "Saved to recents" : "Mark as read"}
        </button>
      </div>
    </>
  );
}

export function Learning() {
  const { slice, dispatch } = useHub();
  return (
    <>
      <ScreenHeader title="Learning" />
      <div className="scroll">
        {learningCourses.map((c) => {
          const p = slice.courses[c.id] ?? c.progress;
          return (
            <div key={c.id} className="card" style={{ marginBottom: 10 }}>
              <div className="between">
                <h4 style={{ margin: 0 }}>{c.title}</h4>
                <span className="tiny">{c.required ? "Required" : "Optional"}</span>
              </div>
              <p className="tiny">Due {c.due}</p>
              <div className="progress">
                <span style={{ width: `${p}%` }} />
              </div>
              <button
                className="cta small"
                style={{ marginTop: 10 }}
                onClick={() => {
                  dispatch({ type: "COURSE", id: c.id, progress: Math.min(100, p + 20) });
                  toast(dispatch, p + 20 >= 100 ? "Course completed" : "Progress saved");
                }}
              >
                {p >= 100 ? "Completed" : "Continue"}
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}

export function Communities() {
  const { dispatch } = useHub();
  const [joined, setJoined] = useState<string[]>(["g1", "g2"]);
  return (
    <>
      <ScreenHeader title="Communities" />
      <div className="scroll">
        {communities.map((g) => (
          <div key={g.id} className="card" style={{ marginBottom: 10 }}>
            <h4 style={{ margin: "0 0 4px" }}>{g.name}</h4>
            <div className="tiny">
              {g.members} members · {g.last}
            </div>
            <button
              className="cta small"
              style={{ marginTop: 10 }}
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

export function Recognition() {
  const { dispatch, user } = useHub();
  const [text, setText] = useState("");
  const [feed, setFeed] = useState(recognitionFeed);
  return (
    <>
      <ScreenHeader title="Recognition" />
      <div className="scroll">
        <div className="field">
          <label>Recognize a colleague</label>
          <textarea rows={3} value={text} onChange={(e) => setText(e.target.value)} placeholder="Say thank you…" />
        </div>
        <button
          className="cta"
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
          Post
        </button>
        {feed.map((r) => (
          <div key={r.id} className="card" style={{ marginTop: 10 }}>
            <b>
              {r.from} → {r.to}
            </b>
            <p style={{ margin: "6px 0" }}>{r.text}</p>
            <div className="tiny">{r.when}</div>
          </div>
        ))}
      </div>
    </>
  );
}

export function Analytics() {
  const nav = useNavigate();
  return (
    <>
      <ScreenHeader title="Analytics" />
      <div className="scroll">
        <div className="list">
          {analyticsCards.map((c) => (
            <button key={c.id} className="list-item" onClick={() => nav("/apps/pbi")}>
              <div>
                <div className="tiny">{c.hint}</div>
                <h4>{c.title}</h4>
                <b className={c.tone === "good" ? "good" : c.tone === "bad" ? "bad" : ""} style={{ fontSize: 22 }}>
                  {c.value}
                </b>
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

export function Admin() {
  const { state, dispatch, user } = useHub();
  if (!user.roles.includes("admin")) {
    return (
      <>
        <ScreenHeader title="Admin Console" />
        <div className="scroll">
          <div className="card">
            <h4>Restricted</h4>
            <p className="muted">Admin Console is available to Avinash B M (Corporate · Tier 1 Admin) in this demo.</p>
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      <ScreenHeader title="Admin Console" />
      <div className="scroll">
        <p className="muted">Content governance · 3-month review cadence · audit trail</p>
        {governanceItems.map((g) => {
          const status = state.governance[g.id] ?? (g.health === "Overdue" ? "In review" : "Published");
          return (
            <div key={g.id} className="card" style={{ marginBottom: 10 }}>
              <div className="between">
                <h4 style={{ margin: 0 }}>{g.title}</h4>
                <span className={g.health === "Overdue" ? "bad" : g.health === "Due soon" ? "" : "good"} style={{ fontSize: 12, fontWeight: 700 }}>
                  {g.health}
                </span>
              </div>
              <p className="tiny">
                Owner {g.owner} · Review due {g.due}
              </p>
              <p className="tiny">Status: {status}</p>
              <div className="row">
                <button className="cta small" onClick={() => dispatch({ type: "GOV", id: g.id, status: "Published" })}>
                  Confirm
                </button>
                <button className="cta small ghost" onClick={() => dispatch({ type: "GOV", id: g.id, status: "Archived" })}>
                  Archive
                </button>
                <button className="cta small ghost" onClick={() => dispatch({ type: "GOV", id: g.id, status: "In review" })}>
                  Send for approval
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export function HubPage({ kind }: { kind: "sales" | "mfg" | "sc" }) {
  const nav = useNavigate();
  const map = {
    sales: {
      title: "Sales Hub",
      items: [
        ["Q3 Sales Playbook", "/knowledge/playbook-q3"],
        ["Territory analytics", "/analytics"],
        ["CRM", "/apps/crm"],
        ["DMS", "/apps/dms"],
      ],
    },
    mfg: {
      title: "Manufacturing Hub",
      items: [
        ["Plant Safety SOP", "/knowledge/sop-plant-safety"],
        ["Plant news", "/news/n3"],
        ["Productivity", "/analytics"],
        ["Service requests", "/services/it"],
      ],
    },
    sc: {
      title: "Supply Chain Hub",
      items: [
        ["Warehouse SOP", "/knowledge/sop-warehouse"],
        ["DMS", "/apps/dms"],
        ["SAP ERP", "/apps/sap"],
        ["Training", "/learning"],
      ],
    },
  } as const;
  const h = map[kind];
  return (
    <>
      <ScreenHeader title={h.title} />
      <div className="scroll">
        {h.items.map(([label, to]) => (
          <button key={label} className="list-item" onClick={() => nav(to)}>
            <Icon name="chevron_right" />
            <div>
              <h4>{label}</h4>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}
