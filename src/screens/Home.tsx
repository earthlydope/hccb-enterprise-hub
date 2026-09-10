import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon, TopBar } from "../ui";
import { useHub, user } from "../store";

export function Home() {
  const nav = useNavigate();
  const { pendingCount, state } = useHub();
  const [q, setQ] = useState("");
  const hour = new Date().getHours();
  const part = hour < 12 ? "MORNING" : hour < 17 ? "AFTERNOON" : "EVENING";
  const credits = state.approvals.filter((a) => a.status === "Pending" && a.type === "Distributor Credit").length;
  const travel = state.approvals.filter((a) => a.status === "Pending" && a.type === "Travel").length;
  const openReq = state.tickets.filter((t) => t.status !== "Resolved").length;
  const training = Math.round(
    Object.values(state.courses).reduce((a, b) => a + b, 0) / Object.keys(state.courses).length
  );

  const actions = [
    { label: "Request Leave", icon: "calendar_month", bg: "#fde7ea", color: "#c5221f", to: "/services/leave", dot: true },
    { label: "Raise IT Ticket", icon: "confirmation_number", bg: "#e8f0fe", color: "#1967d2", to: "/services/it" },
    { label: "Download Payslip", icon: "receipt_long", bg: "#e6f4ea", color: "#137333", to: "/workspace/payslips" },
    { label: "Book Travel", icon: "flight", bg: "#e8f0fe", color: "#185abc", to: "/services/travel" },
    { label: "Apply Job", icon: "work", bg: "#fef7e0", color: "#b06000", to: "/services/jobs" },
  ];

  return (
    <>
      <TopBar title="Home" />
      <div className="scroll">
        <div className="between">
          <div>
            <div className="kicker">GOOD {part}</div>
            <h1 className="h1" style={{ marginBottom: 8 }}>
              {user.fullName} 👋
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
            <Icon name="work" size={16} /> {user.department}
          </span>
          <button className="chip dark" onClick={() => nav("/admin")}>
            <Icon name="admin_panel_settings" size={16} /> Admin Console
          </button>
        </div>

        <div className="card alert" style={{ marginTop: 14 }}>
          <div className="alert-head">
            <span className="alert-label">
              <span className="dot" style={{ background: "var(--red)" }} /> ACTION REQUIRED
            </span>
            <span className="pill">{pendingCount} New</span>
          </div>
          <h2 className="h2" style={{ margin: "10px 0 4px", fontSize: 22 }}>
            {pendingCount} Pending Approvals
          </h2>
          <p className="muted" style={{ margin: 0 }}>
            {credits} Distributor Credit Requests • {travel} Travel Claims
          </p>
          <div className="row">
            <button className="cta" style={{ flex: 1 }} onClick={() => nav("/workspace")}>
              Review in Workspace <Icon name="arrow_forward" size={18} />
            </button>
            <button className="icon-round" onClick={() => nav("/notifications")} aria-label="Reminders">
              <Icon name="schedule" />
            </button>
          </div>
          <div className="stats">
            <button className="stat" onClick={() => nav("/services/leave")}>
              <span>Leave Balance</span>
              <b>12 days</b>
            </button>
            <button className="stat" onClick={() => nav("/learning")}>
              <span>Training</span>
              <b className="good">{training}%</b>
            </button>
            <button className="stat" onClick={() => nav("/services/it")}>
              <span>Open Req</span>
              <b className="bad">{openReq}</b>
            </button>
          </div>
        </div>

        <div className="section-title">
          <h3>Quick Actions</h3>
          <button className="link" onClick={() => nav("/services")}>
            Workplace Shortcuts
          </button>
        </div>
        <div className="qa">
          {actions.map((a) => (
            <button key={a.label} className="qa-item" onClick={() => nav(a.to)}>
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
          <button className="link" onClick={() => nav("/apps")}>
            All Tools
          </button>
        </div>
        <div className="systems">
          {[
            { id: "sap", name: "SAP ERP", sub: "Ops & Supply", bg: "#fce8e6", c: "#c5221f", t: "SAP" },
            { id: "crm", name: "Sales CRM", sub: "Field & Outlets", bg: "#fef7e0", c: "#b06000", t: "CRM" },
            { id: "dms", name: "DMS", sub: "Distributor Mgmt", bg: "#e8f0fe", c: "#1967d2", t: "DMS" },
          ].map((s) => (
            <button key={s.id} className="sys" onClick={() => nav(`/apps/${s.id}`)}>
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

        <div className="copilot-card">
          <div className="between">
            <div className="row">
              <Icon name="auto_awesome" />
              <div>
                <b>Ask HCCB Copilot</b>
                <div className="tiny">Instant policies, SOPs, and metrics</div>
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
              placeholder="Ask anything about policies, leaves or sale"
            />
            <button className="send" type="submit" aria-label="Ask">
              <Icon name="arrow_forward" size={16} />
            </button>
          </form>
        </div>

        <div className="section-title">
          <h3>Company News</h3>
          <button className="link" onClick={() => nav("/news")}>
            See all
          </button>
        </div>
        <button className="list-item" onClick={() => nav("/news/n1")}>
          <Icon name="campaign" />
          <div>
            <h4>CEO note: Safety first this festive season</h4>
            <div className="tiny">Leadership · 3 min · 2h ago</div>
          </div>
        </button>
      </div>
    </>
  );
}
