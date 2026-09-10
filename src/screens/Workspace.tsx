import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Icon, ScreenHeader, TopBar } from "../ui";
import { toast, useHub } from "../store";
import type { ApprovalStatus } from "../data";
import { isManager, isSupport } from "../personas";

const filters = ["Pending", "Approved", "Rejected", "Changes requested", "All"] as const;

export function Workspace() {
  const { state, slice, pendingCount, user } = useHub();
  const nav = useNavigate();
  const [tab, setTab] = useState<(typeof filters)[number]>("Pending");
  const manager = isManager(user);
  const support = isSupport(user);
  const items = state.approvals.filter((a) => (tab === "All" ? true : a.status === tab));
  const openTickets = slice.tickets.filter((t) => t.status !== "Resolved");

  return (
    <>
      <TopBar title="Workspace" />
      <div className="scroll">
        <div className="kicker">{manager ? "Corporate" : support ? "Support" : "My work"}</div>
        <h1 className="h1" style={{ fontSize: 22 }}>
          {manager ? "Approvals & documents" : support ? "Employee tickets & requests" : "My requests & documents"}
        </h1>
        <p className="muted">{user.homeFocus}</p>
        <div className="stats" style={{ background: "#fff", borderRadius: 16, padding: 8, marginBottom: 12 }}>
          <button className="stat" onClick={() => (manager ? setTab("Pending") : nav("/services/it"))}>
            <span>{manager ? "Pending" : support ? "Tickets" : "My leave"}</span>
            <b className="bad">{manager ? pendingCount : support ? openTickets.length : user.leaveDays}</b>
          </button>
          <button className="stat" onClick={() => nav("/services/leave")}>
            <span>Leave</span>
            <b>{user.leaveDays}d</b>
          </button>
          <button className="stat" onClick={() => nav("/workspace/payslips")}>
            <span>Payslips</span>
            <b>{user.nets}</b>
          </button>
        </div>
        {manager ? (
          <>
            <div className="filters">
              {filters.map((f) => (
                <button key={f} className={tab === f ? "filter on" : "filter"} onClick={() => setTab(f)}>
                  {f}
                </button>
              ))}
            </div>
            <div className="list">
              {items.length === 0 && <div className="card muted">Nothing in {tab.toLowerCase()}.</div>}
              {items.map((a) => (
                <button key={a.id} className="list-item" onClick={() => nav(`/approvals/${a.id}`)}>
                  <div className="sys-mark" style={{ background: "#fef2f2", color: "#f40009" }}>
                    {a.type.slice(0, 3).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, textAlign: "left" }}>
                    <h4>{a.title}</h4>
                    <div className="tiny">
                      {a.requester} · {a.submitted} · {a.amount}
                    </div>
                    <div className="tiny" style={{ marginTop: 4 }}>
                      {a.status}
                    </div>
                  </div>
                  <Icon name="chevron_right" />
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="section-title">
              <h3>{support ? "Assigned tickets" : "My tickets"}</h3>
            </div>
            {slice.tickets.length === 0 && <div className="card muted">No tickets.</div>}
            {slice.tickets.map((t) => (
              <div key={t.id} className="list-item">
                <Icon name="confirmation_number" />
                <div>
                  <h4>
                    {t.id} · {t.status}
                  </h4>
                  <div className="tiny">
                    {t.title} · {t.priority}
                  </div>
                </div>
              </div>
            ))}
            <div className="section-title">
              <h3>Leave submitted</h3>
            </div>
            {slice.leaves.map((l) => (
              <div key={l.id} className="list-item">
                <Icon name="event" />
                <div>
                  <h4>
                    {l.type} · {l.status}
                  </h4>
                  <div className="tiny">
                    {l.from} → {l.to} ({l.days}d)
                  </div>
                </div>
              </div>
            ))}
            {slice.travels.length > 0 && (
              <>
                <div className="section-title">
                  <h3>Travel</h3>
                </div>
                {slice.travels.map((t) => (
                  <div key={t.id} className="list-item">
                    <Icon name="flight" />
                    <div>
                      <h4>
                        {t.dest} · {t.status}
                      </h4>
                      <div className="tiny">
                        {t.dates} · {t.cost}
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </>
        )}
        <div className="section-title">
          <h3>My documents</h3>
        </div>
        <button className="list-item" onClick={() => nav("/workspace/payslips")}>
          <Icon name="payments" />
          <div>
            <h4>Payslips</h4>
            <div className="tiny">Last credited · Net {user.nets}</div>
          </div>
        </button>
        <button className="list-item" onClick={() => nav("/learning")}>
          <Icon name="school" />
          <div>
            <h4>Training status</h4>
            <div className="tiny">{user.training}% complete</div>
          </div>
        </button>
      </div>
    </>
  );
}

export function ApprovalDetail() {
  const { id } = useParams();
  const { state, dispatch } = useHub();
  const nav = useNavigate();
  const a = state.approvals.find((x) => x.id === id);
  if (!a) {
    return (
      <>
        <ScreenHeader title="Approval" />
        <div className="scroll">Not found.</div>
      </>
    );
  }
  const act = (status: ApprovalStatus, msg: string) => {
    dispatch({ type: "SET_APPROVAL", id: a.id, status });
    toast(dispatch, msg);
    nav("/workspace");
  };
  return (
    <>
      <ScreenHeader title={a.id} />
      <div className="scroll">
        <div className="card">
          <span className="pill">{a.type}</span>
          <h2 className="h2" style={{ marginTop: 10 }}>
            {a.title}
          </h2>
          <p className="muted">{a.summary}</p>
          <p className="tiny">
            {a.requester} · {a.requesterRole} · {a.submitted}
          </p>
          {a.details.map((d) => (
            <div key={d} className="row" style={{ marginTop: 8 }}>
              <Icon name="check_circle" size={18} />
              <span style={{ fontSize: 13 }}>{d}</span>
            </div>
          ))}
        </div>
        {a.status === "Pending" ? (
          <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
            <button className="cta" onClick={() => act("Approved", `${a.id} approved`)}>
              Approve
            </button>
            <button className="cta ghost" onClick={() => act("Changes requested", `Changes requested on ${a.id}`)}>
              Request changes
            </button>
            <button className="cta ghost" onClick={() => act("Rejected", `${a.id} rejected`)}>
              Reject
            </button>
          </div>
        ) : (
          <div className="card" style={{ marginTop: 12 }}>
            Status: <b>{a.status}</b>
          </div>
        )}
      </div>
    </>
  );
}

export function Payslips() {
  const { dispatch, user } = useHub();
  const months = ["Aug 2026", "Jul 2026", "Jun 2026", "May 2026", "Apr 2026", "Mar 2026"];
  return (
    <>
      <ScreenHeader title="Payslips" />
      <div className="scroll">
        <p className="muted">Authorized employee copies for {user.fullName}. Demo files stay in the browser.</p>
        <div className="list">
          {months.map((m) => (
            <button
              key={m}
              className="list-item"
              onClick={() => {
                const blob = new Blob(
                  [`HCCB Payslip — ${m}\nEmployee: ${user.fullName}\nEmp ID: ${user.empId}\nNet pay: ${user.nets}\nThis is a demo document.`],
                  { type: "text/plain" }
                );
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `HCCB-Payslip-${m.replace(" ", "-")}.txt`;
                a.click();
                URL.revokeObjectURL(url);
                toast(dispatch, `Downloaded payslip for ${m}`);
              }}
            >
              <Icon name="picture_as_pdf" />
              <div>
                <h4>{m}</h4>
                <div className="tiny">Net pay {user.nets}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
