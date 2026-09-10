import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Icon, ScreenHeader, TopBar } from "../ui";
import { jobs, services } from "../data";
import { toast, useHub } from "../store";

export function Services() {
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const groups = ["HR", "IT", "Work"] as const;
  const filtered = services.filter((s) => s.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <TopBar title="Services" />
      <div className="scroll">
        <h1 className="h1">Catalog & requests</h1>
        <div className="searchbar">
          <Icon name="search" size={18} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search services" />
        </div>
        {groups.map((g) => (
          <div key={g}>
            <div className="section-title">
              <h3>{g}</h3>
            </div>
            <div className="list">
              {filtered
                .filter((s) => s.group === g)
                .map((s) => (
                  <button key={s.id} className="list-item" data-hint={["leave", "payslip", "letters", "travel", "attendance", "it", "mfg"].includes(s.id) ? `svc-${s.id}` : undefined} onClick={() => nav(s.to)}>
                    <Icon name={s.icon} />
                    <div style={{ flex: 1, textAlign: "left" }}>
                      <h4>{s.name}</h4>
                    </div>
                    <Icon name="chevron_right" />
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export function LeaveForm() {
  const { dispatch, slice, user } = useHub();
  const nav = useNavigate();
  const [type, setType] = useState("Casual Leave");
  const [from, setFrom] = useState("2026-09-18");
  const [to, setTo] = useState("2026-09-19");
  const [note, setNote] = useState("");
  const days = useMemo(() => {
    const d = Math.max(1, Math.round((+new Date(to) - +new Date(from)) / 86400000) + 1);
    return Number.isFinite(d) ? d : 1;
  }, [from, to]);
  return (
    <>
      <ScreenHeader title="Request Leave" />
      <div className="scroll">
        <div className="card" style={{ marginBottom: 12 }}>
          Leave balance <b>{user.leaveDays} days</b> · Policy SLA 48h
        </div>
        <div className="field">
          <label>Leave type</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option>Casual Leave</option>
            <option>Earned Leave</option>
            <option>Sick Leave</option>
          </select>
        </div>
        <div className="field">
          <label>From</label>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        </div>
        <div className="field">
          <label>To</label>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
        <div className="field">
          <label>Note</label>
          <textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} />
        </div>
        <p className="muted">{days} day(s) will be deducted if approved.</p>
        <button
          className="cta"
          data-hint="leave-submit"
          onClick={() => {
            dispatch({
              type: "ADD_LEAVE",
              leave: {
                id: `LV-${1000 + slice.leaves.length}`,
                type,
                from,
                to,
                days,
                note,
                status: "Submitted",
              },
              approval: {
                id: `APR-LEAVE-${Date.now().toString().slice(-5)}`,
                type: "Leave",
                title: `${type} — ${user.fullName}`,
                requester: user.fullName,
                requesterRole: user.roleTitle,
                submitted: "Just now",
                summary: note || `${days} day(s) ${type}`,
                status: "Pending",
                details: [`${from} → ${to}`, `${days} day(s)`, user.location],
              },
            });
            toast(dispatch, "Leave request submitted");
            nav("/workspace");
          }}
        >
          Submit request
        </button>
        <div className="section-title">
          <h3>History</h3>
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
      </div>
    </>
  );
}

export function TicketForm() {
  const { dispatch, slice } = useHub();
  const nav = useNavigate();
  const [category, setCategory] = useState("Network");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Medium");
  const [app, setApp] = useState("Laptop");
  return (
    <>
      <ScreenHeader title="Raise IT Ticket" />
      <div className="scroll">
        <p className="muted">Routes to ServiceNow. You will get an INC number instantly.</p>
        <div className="field">
          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option>Network</option>
            <option>Access</option>
            <option>Hardware</option>
            <option>Application</option>
          </select>
        </div>
        <div className="field">
          <label>Device / application</label>
          <input value={app} onChange={(e) => setApp(e.target.value)} />
        </div>
        <div className="field">
          <label>Summary</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Short issue title" />
        </div>
        <div className="field">
          <label>Description</label>
          <textarea rows={4} value={desc} onChange={(e) => setDesc(e.target.value)} />
        </div>
        <div className="field">
          <label>Priority</label>
          <select value={priority} onChange={(e) => setPriority(e.target.value as typeof priority)}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>
        <button
          className="cta"
          data-hint="it-submit"
          disabled={!title.trim()}
          onClick={() => {
            const id = `INC-${21000 + slice.tickets.length}`;
            dispatch({
              type: "ADD_TICKET",
              ticket: {
                id,
                title: title.trim(),
                category: `${category} · ${app}`,
                priority,
                status: "Open",
                updated: "Just now",
                note: desc.trim() || undefined,
              },
            });
            toast(dispatch, `${id} created`);
            nav("/workspace");
          }}
        >
          Submit ticket
        </button>
        <div className="section-title">
          <h3>Open requests</h3>
        </div>
        {slice.tickets.map((t) => (
          <div key={t.id} className="list-item">
            <Icon name="confirmation_number" />
            <div>
              <h4>
                {t.id} · {t.status}
              </h4>
              <div className="tiny">
                  {t.title} · {t.priority} · {t.updated}
                  {t.note ? ` · ${t.note}` : ""}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export function TravelForm() {
  const { dispatch, slice, user } = useHub();
  const nav = useNavigate();
  const [dest, setDest] = useState("Hyderabad");
  const [dates, setDates] = useState("12–13 Sep 2026");
  const [purpose, setPurpose] = useState("Market visit");
  return (
    <>
      <ScreenHeader title="Book Travel" />
      <div className="scroll">
        <div className="card" style={{ marginBottom: 12 }}>
          Policy: economy default · metro hotel cap ₹6,500 · claims in 7 days.
          <button className="link" style={{ display: "block", marginTop: 8 }} onClick={() => nav("/knowledge/pol-travel")}>
            Open travel policy
          </button>
        </div>
        <div className="field">
          <label>Destination</label>
          <input value={dest} onChange={(e) => setDest(e.target.value)} />
        </div>
        <div className="field">
          <label>Dates</label>
          <input value={dates} onChange={(e) => setDates(e.target.value)} />
        </div>
        <div className="field">
          <label>Purpose</label>
          <input value={purpose} onChange={(e) => setPurpose(e.target.value)} />
        </div>
        <button
          className="cta"
          data-hint="travel-submit"
          onClick={() => {
            const id = `TR-${900 + slice.travels.length}`;
            dispatch({
              type: "ADD_TRAVEL",
              item: { id, dest, dates, status: "Pending approval", cost: "Est. ₹18,600" },
              approval: {
                id: `APR-${id}`,
                type: "Travel",
                title: `${dest} — ${user.fullName}`,
                requester: user.fullName,
                requesterRole: user.roleTitle,
                amount: "Est. ₹18,600",
                submitted: "Just now",
                summary: purpose,
                status: "Pending",
                details: [dates, purpose, user.location],
              },
            });
            toast(dispatch, `${id} submitted for approval`);
            nav("/workspace");
          }}
        >
          Submit for approval
        </button>
        {slice.travels.map((t) => (
          <div key={t.id} className="list-item" style={{ marginTop: 8 }}>
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
      </div>
    </>
  );
}

export function Jobs() {
  const nav = useNavigate();
  return (
    <>
      <ScreenHeader title="Internal Jobs" />
      <div className="scroll">
        <div className="list">
          {jobs.map((j) => (
            <button key={j.id} className="list-item" onClick={() => nav(`/services/jobs/${j.id}`)}>
              <Icon name="work" />
              <div style={{ flex: 1, textAlign: "left" }}>
                <h4>{j.title}</h4>
                <div className="tiny">
                  {j.location} · {j.type}
                </div>
              </div>
              <Icon name="chevron_right" />
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

export function JobDetail() {
  const { id } = useParams();
  const job = jobs.find((j) => j.id === id);
  const { slice, dispatch } = useHub();
  if (!job) return null;
  const applied = slice.jobApps.includes(job.id);
  return (
    <>
      <ScreenHeader title="Role" />
      <div className="scroll">
        <div className="card">
          <h2 className="h2">{job.title}</h2>
          <p className="muted">
            {job.location} · {job.type}
          </p>
          <p>Eligibility: {job.eligibility}</p>
          <p className="tiny">Internal mobility is encouraged. Manager endorsement is requested after apply.</p>
        </div>
        <button
          className="cta"
          disabled={applied}
          onClick={() => {
            dispatch({ type: "APPLY_JOB", id: job.id });
            toast(dispatch, "Application submitted");
          }}
        >
          {applied ? "Applied" : "Apply"}
        </button>
      </div>
    </>
  );
}

export function Letters() {
  const { dispatch, slice } = useHub();
  const kinds = ["Employment letter", "Address proof", "Salary certificate"];
  return (
    <>
      <ScreenHeader title="Employee Letters" />
      <div className="scroll">
        {kinds.map((k) => (
          <button
            key={k}
            className="list-item"
            onClick={() => {
              dispatch({ type: "LETTER", name: k });
              toast(dispatch, `${k} requested — HR will notify`);
            }}
          >
            <Icon name="mail" />
            <div>
              <h4>{k}</h4>
              <div className="tiny">{slice.letters.includes(k) ? "Requested" : "Tap to request"}</div>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}

export function Attendance() {
  const { user } = useHub();
  return (
    <>
      <ScreenHeader title="Attendance" />
      <div className="scroll">
        <div className="card">
          <h2 className="h2">Sep 2026</h2>
          <p>Present 8 · WFH 0 · Leave 0 · Holidays 2</p>
          <p className="tiny">Swipe source: {user.location} · last punch today 09:04</p>
        </div>
      </div>
    </>
  );
}
