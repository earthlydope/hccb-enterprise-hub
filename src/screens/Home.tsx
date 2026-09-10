import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon, TopBar } from "../ui";
import { newsItems } from "../data";
import { isAdmin, isManager, isPlant, isSupport } from "../personas";
import { useHub } from "../store";

export function Home() {
  const nav = useNavigate();
  const { pendingCount, slice, user, state } = useHub();
  const [q, setQ] = useState("");
  const [claps, setClaps] = useState(48);
  const [clapOn, setClapOn] = useState(false);
  const hour = new Date().getHours();
  const part = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const pending = state.approvals.filter((a) => a.status === "Pending");
  const creditN = pending.filter((a) => a.type === "Distributor Credit").length;
  const travelN = pending.filter((a) => a.type === "Travel").length;
  const leaveN = pending.filter((a) => a.type === "Leave").length;
  const openReq = slice.tickets.filter((t) => t.status !== "Resolved").length;
  const training = user.training;
  const hero = newsItems[0];
  const manager = isManager(user);
  const plant = isPlant(user);
  const support = isSupport(user);

  const actions = plant
    ? [
        { hint: "qa-attendance", label: "Punch / Attendance", icon: "schedule", bg: "#ecfdf5", color: "#059669", to: "/services/attendance", dot: true },
        { hint: "qa-leave", label: "Request Leave", icon: "calendar_month", bg: "#fef2f2", color: "#f40009", to: "/services/leave" },
        { hint: "qa-knowledge", label: "Plant SOP", icon: "menu_book", bg: "#0f172a", color: "#fff", to: "/knowledge" },
        { hint: "qa-payslips", label: "Payslip", icon: "receipt_long", bg: "#eff6ff", color: "#2563eb", to: "/workspace/payslips" },
        { hint: "qa-it", label: "IT Ticket", icon: "confirmation_number", bg: "#fffbeb", color: "#d97706", to: "/services/it" },
      ]
    : support
      ? [
          { hint: "qa-tickets", label: "Ticket queue", icon: "confirmation_number", bg: "#eff6ff", color: "#2563eb", to: "/workspace", dot: true },
          { hint: "qa-letters", label: "Employee letters", icon: "mail", bg: "#fef2f2", color: "#f40009", to: "/services/letters" },
          { hint: "qa-communities", label: "Communities", icon: "groups", bg: "#ecfdf5", color: "#059669", to: "/communities" },
          { hint: "qa-it", label: "Raise IT Ticket", icon: "computer", bg: "#f5f3ff", color: "#7c3aed", to: "/services/it" },
          { hint: "qa-leave", label: "Request Leave", icon: "calendar_month", bg: "#fffbeb", color: "#d97706", to: "/services/leave" },
        ]
      : [
          { hint: "qa-workspace", label: "Review queue", icon: "fact_check", bg: "#fef2f2", color: "#f40009", to: "/workspace", dot: manager },
          { hint: "qa-leave", label: "Request Leave", icon: "calendar_month", bg: "#eff6ff", color: "#2563eb", to: "/services/leave" },
          { hint: "qa-travel", label: "Book Travel", icon: "flight", bg: "#f5f3ff", color: "#7c3aed", to: "/services/travel" },
          { hint: "qa-payslips", label: "Payslips", icon: "receipt_long", bg: "#ecfdf5", color: "#059669", to: "/workspace/payslips" },
          { hint: "qa-admin", label: "Admin", icon: "admin_panel_settings", bg: "#0f172a", color: "#fff", to: "/admin" },
        ];

  const systems = plant
    ? [
        { id: "sap", name: "SAP ERP", sub: "Line & supply", bg: "#fef2f2", c: "#f40009", t: "SAP" },
        { id: "snow", name: "ServiceNow", sub: "Plant tickets", bg: "#ecfdf5", c: "#137333", t: "SN" },
        { id: "lms", name: "LMS", sub: "Safety modules", bg: "#eff6ff", c: "#185ABC", t: "LMS" },
        { id: "pbi", name: "Power BI", sub: "Line OEE", bg: "#ecfdf5", c: "#059669", t: "PBI" },
      ]
    : support
      ? [
          { id: "snow", name: "ServiceNow", sub: "Employee tickets", bg: "#ecfdf5", c: "#137333", t: "SN" },
          { id: "hr", name: "HR Portal", sub: "Letters & people", bg: "#fef2f2", c: "#a50e0e", t: "HR" },
          { id: "lms", name: "LMS", sub: "Required learning", bg: "#eff6ff", c: "#185ABC", t: "LMS" },
          { id: "teams", name: "Microsoft Teams", sub: "Support huddles", bg: "#e8f0fe", c: "#5b5fc7", t: "MS" },
        ]
      : [
          { id: "sap", name: "SAP ERP", sub: "Ops & Supply", bg: "#fef2f2", c: "#f40009", t: "SAP" },
          { id: "crm", name: "Sales CRM", sub: "Field & Outlets", bg: "#fffbeb", c: "#d97706", t: "CRM" },
          { id: "pbi", name: "Power BI", sub: "Commercial BI", bg: "#ecfdf5", c: "#059669", t: "PBI" },
          { id: "hr", name: "HR Portal", sub: "People", bg: "#fef2f2", c: "#a50e0e", t: "HR" },
        ];

  return (
    <>
      <TopBar title="Home" />
      <div className="scroll">
        <div className="between">
          <div>
            <div className="kicker">{part}</div>
            <h1 className="h1">
              {user.firstName}
            </h1>
          </div>
          <span className="chip live">
            <span className="dot" /> Active
          </span>
        </div>
        <div className="wrap">
          <span className="chip">
            <Icon name="factory" size={16} /> {user.location}
          </span>
          <span className="chip">
            <Icon name="badge" size={16} /> {user.department}
          </span>
          <span className="chip">{user.lane}</span>
          {isAdmin(user) && (
            <button className="chip dark" data-hint="home-admin" onClick={() => nav("/admin")}>
              <Icon name="admin_panel_settings" size={16} /> Admin Console
            </button>
          )}
        </div>

        {manager ? (
          <div className="card alert" style={{ marginTop: 14 }}>
            <div className="alert-head">
              <span className="alert-label">Corporate queue</span>
              <span className="pill">{pendingCount} New</span>
            </div>
            <h2 className="h2" style={{ margin: "8px 0 4px" }}>
              {pendingCount} Pending Approvals
            </h2>
            <p className="muted" style={{ margin: 0 }}>
              {creditN} credit · {travelN} travel · {leaveN} leave
            </p>
            <div className="row">
              <button className="cta" data-hint="home-review" style={{ flex: 1 }} onClick={() => nav("/workspace")}>
                Review in Workspace <Icon name="arrow_forward" size={18} />
              </button>
              <button className="icon-round" onClick={() => nav("/notifications")} aria-label="Reminders">
                <Icon name="schedule" />
              </button>
            </div>
            <div className="stats">
              <button className="stat" data-hint="home-leave" onClick={() => nav("/services/leave")}>
                <span>Leave Balance</span>
                <b>
                  {user.leaveDays} <span className="tiny">days</span>
                </b>
              </button>
              <button className="stat" data-hint="home-train" onClick={() => nav("/learning")}>
                <span>Training</span>
                <b className="good">{training}%</b>
              </button>
              <button className="stat" data-hint="home-gov" onClick={() => nav("/admin")}>
                <span>Governance</span>
                <b>4</b>
              </button>
            </div>
          </div>
        ) : plant ? (
          <div className="card alert" style={{ marginTop: 14, background: "#0f172a", color: "#fff", border: 0 }}>
            <div className="kicker" style={{ color: "#ff8a80" }}>
              Required SOP
            </div>
            <h2 className="h2" style={{ color: "#fff", margin: "6px 0" }}>
              Chemical handling & CIP safety
            </h2>
            <p className="tiny" style={{ color: "#94a3b8" }}>
              Sign before shift start · {user.location}
            </p>
            <button className="cta" data-hint="home-sop" onClick={() => nav("/knowledge")}>
              Open Knowledge Hub
            </button>
            <div className="stats" style={{ background: "transparent", marginTop: 10 }}>
              <button className="stat" style={{ color: "#fff" }} data-hint="home-leave" onClick={() => nav("/services/leave")}>
                <span>Leave</span>
                <b>
                  {user.leaveDays}d
                </b>
              </button>
              <button className="stat" style={{ color: "#fff" }} data-hint="home-train" onClick={() => nav("/learning")}>
                <span>Training</span>
                <b>{training}%</b>
              </button>
              <button className="stat" style={{ color: "#fff" }} data-hint="home-punch" onClick={() => nav("/services/attendance")}>
                <span>Punch</span>
                <b>09:04</b>
              </button>
            </div>
          </div>
        ) : (
          <div className="card alert" style={{ marginTop: 14 }}>
            <span className="alert-label">Support desk</span>
            <h2 className="h2" style={{ margin: "8px 0 4px" }}>
              {openReq} open employee tickets
            </h2>
            <p className="muted">{user.homeFocus}</p>
            <div className="row">
              <button className="cta" data-hint="home-tickets" style={{ flex: 1 }} onClick={() => nav("/workspace")}>
                Open queue
              </button>
              <button className="cta ghost" data-hint="home-communities" style={{ flex: 1 }} onClick={() => nav("/communities")}>
                Communities
              </button>
            </div>
            <div className="stats">
              <button className="stat" data-hint="home-leave" onClick={() => nav("/services/leave")}>
                <span>My leave</span>
                <b>{user.leaveDays}d</b>
              </button>
              <button className="stat" data-hint="home-train" onClick={() => nav("/learning")}>
                <span>Training</span>
                <b className="good">{training}%</b>
              </button>
              <button className="stat" data-hint="home-letters" onClick={() => nav("/services/letters")}>
                <span>Letters</span>
                <b>{slice.letters.length}</b>
              </button>
            </div>
          </div>
        )}

        <div className="section-title">
          <h3>Quick Actions</h3>
          <span className="tiny">{user.lane} shortcuts</span>
        </div>
        <div className="qa">
          {actions.map((a) => (
            <button key={a.label} className="qa-item" data-hint={a.hint} onClick={() => nav(a.to)}>
              <div className="qa-ico" style={{ background: a.bg, color: a.color, position: "relative" }}>
                <Icon name={a.icon} size={20} />
                {a.dot && (
                  <span
                    style={{
                      position: "absolute",
                      top: 4,
                      right: 6,
                      width: 7,
                      height: 7,
                      background: "var(--red)",
                      borderRadius: 99,
                    }}
                  />
                )}
              </div>
              <p>{a.label}</p>
            </button>
          ))}
        </div>

        <div className="section-title">
          <h3>Core Systems</h3>
          <button className="link" data-hint="home-apps" onClick={() => nav("/apps")}>
            All Tools
          </button>
        </div>
        <div className="systems">
          {systems.map((s) => (
            <button key={s.id} className="sys" data-hint={`sys-${s.id}`} onClick={() => nav(`/apps/${s.id}`)}>
              <div className="sys-mark" style={{ background: s.bg, color: s.c }}>
                {s.t}
              </div>
              <div>
                <b>{s.name}</b>
                <span>{s.sub}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="copilot-card" data-hint="home-copilot">
          <div className="between">
            <div className="row">
              <Icon name="auto_awesome" />
              <div>
                <b>Ask HCCB Copilot</b>
                <div className="tiny">Policies, SOPs, and your balance</div>
              </div>
            </div>
            <span className="pill">AI</span>
          </div>
          <form
            className="searchbar"
            onSubmit={(e) => {
              e.preventDefault();
              nav(`/copilot?q=${encodeURIComponent(q)}`);
            }}
          >
            <Icon name="search" size={18} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Ask about leave, SOP or tickets..."
            />
            <button className="send" type="submit" aria-label="Ask">
              <Icon name="arrow_forward" size={16} />
            </button>
          </form>
          <div className="suggest">
            <button onClick={() => nav("/copilot?q=" + encodeURIComponent("What is my leave balance?"))}>Leave balance</button>
            <button onClick={() => nav("/knowledge")}>Plant Safety SOP</button>
            <button onClick={() => nav("/copilot?q=" + encodeURIComponent(manager ? "Show pending approvals" : "IT ticket status"))}>
              {manager ? "Pending approvals" : "IT tickets"}
            </button>
          </div>
        </div>

        <div className="section-title">
          <h3>News & Leadership</h3>
          <button className="link" onClick={() => nav("/news")}>
            View All
          </button>
        </div>
        <button className="news-hero" data-hint="home-news" onClick={() => nav(`/news/${hero.id}`)}>
          <img src="/people/plant.jpg" alt="HCCB plant" />
          <div className="body">
            <span className="pill">{hero.category}</span>
            <h3>{hero.title}</h3>
            <p className="tiny">{hero.time}</p>
          </div>
        </button>
        <div className="card townhall" style={{ marginTop: 10 }}>
          <div className="cal">
            <span>Thu</span>
            <b>24</b>
          </div>
          <div style={{ flex: 1 }}>
            <div className="tiny">Upcoming Townhall</div>
            <b>Executive Leadership Quarterly Address</b>
            <div className="tiny">3:00 PM IST · Teams Live</div>
          </div>
          <button className="icon-round" onClick={() => nav("/news")} aria-label="Calendar">
            <Icon name="calendar_today" size={18} />
          </button>
        </div>

        <div className="section-title">
          <h3>Recognition & Kudos</h3>
          <button className="link" onClick={() => nav("/recognition")}>
            Celebrate
          </button>
        </div>
        <div className="card kudos">
          <div className="head">
            <div className="row">
              <img className="avatar" src="/avinash.jpg" alt="Avinash B M" />
              <div>
                <b>Avinash B M</b>
                <div className="tiny">Corporate Operations · 2h ago</div>
              </div>
            </div>
            <span className="pill">Superstar Award</span>
          </div>
          <p className="muted" style={{ margin: 0 }}>
            Clean CIP handover on <b style={{ color: "var(--red)" }}>Chittoor Line 2</b> — plant and support teams closed it together.
          </p>
          <div className="between">
            <button
              className={`chip clap-btn ${clapOn ? "pop" : ""}`}
              onClick={() => {
                setClaps((c) => c + 1);
                setClapOn(true);
                window.setTimeout(() => setClapOn(false), 280);
              }}
            >
              <Icon name="favorite" size={16} /> {claps} Claps
            </button>
            <button className="link" onClick={() => nav("/recognition")}>
              Congratulate
            </button>
          </div>
        </div>
        <button className="list-item" style={{ marginTop: 12 }} data-hint="home-communities" onClick={() => nav("/communities")}>
          <Icon name="groups" />
          <div>
            <h4>Communities</h4>
            <div className="tiny">Plant huddles, support desk, run club</div>
          </div>
        </button>
      </div>
    </>
  );
}
