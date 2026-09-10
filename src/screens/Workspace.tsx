import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Icon, ScreenHeader, TopBar } from "../ui";
import { toast, useHub } from "../store";
import type { ApprovalStatus } from "../data";

export function Workspace() {
  const { state, pendingCount } = useHub();
  const nav = useNavigate();
  const [tab, setTab] = useState<"Pending" | "Approved" | "Rejected" | "All">("Pending");
  const items = state.approvals.filter((a) => (tab === "All" ? true : a.status === tab));

  return (
    <>
      <TopBar title="Workspace" />
      <div className="scroll">
        <div className="kicker">MY WORKSPACE</div>
        <h1 className="h1">Approvals & self-service</h1>
        <div className="stats" style={{ background: "#fff", borderRadius: 16, padding: 8, marginBottom: 12 }}>
          <button className="stat" onClick={() => setTab("Pending")}>
            <span>Pending</span>
            <b className="bad">{pendingCount}</b>
          </button>
          <button className="stat" onClick={() => nav("/services/leave")}>
            <span>Leave</span>
            <b>12d</b>
          </button>
          <button className="stat" onClick={() => nav("/workspace/payslips")}>
            <span>Payslips</span>
            <b>6</b>
          </button>
        </div>
        <div className="filters">
          {(["Pending", "Approved", "Rejected", "All"] as const).map((f) => (
            <button key={f} className={tab === f ? "filter on" : "filter"} onClick={() => setTab(f)}>
              {f}
            </button>
          ))}
        </div>
        <div className="list">
          {items.length === 0 && <div className="card muted">Nothing in {tab.toLowerCase()}.</div>}
          {items.map((a) => (
            <button key={a.id} className="list-item" onClick={() => nav(`/approvals/${a.id}`)}>
              <div className="sys-mark" style={{ background: "#fde7ea", color: "#c5221f" }}>
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
        <div className="section-title">
          <h3>My documents</h3>
        </div>
        <button className="list-item" onClick={() => nav("/workspace/payslips")}>
          <Icon name="payments" />
          <div>
            <h4>Payslips</h4>
            <div className="tiny">Last generated Aug 2026</div>
          </div>
        </button>
        <button className="list-item" onClick={() => nav("/learning")}>
          <Icon name="school" />
          <div>
            <h4>Training status</h4>
            <div className="tiny">2 required courses in progress</div>
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
  const { dispatch } = useHub();
  const months = ["Aug 2026", "Jul 2026", "Jun 2026", "May 2026", "Apr 2026", "Mar 2026"];
  return (
    <>
      <ScreenHeader title="Payslips" />
      <div className="scroll">
        <p className="muted">Authorized employee copies. Demo files stay in the browser.</p>
        <div className="list">
          {months.map((m) => (
            <button
              key={m}
              className="list-item"
              onClick={() => {
                const blob = new Blob(
                  [`HCCB Payslip — ${m}\nEmployee: Avinash B M\nNet pay: ₹1,84,220\nThis is a demo document.`],
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
                <div className="tiny">Net pay ₹1,84,220</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
