import { useEffect, useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Icon } from "./ui";
import { isAdmin, isManager, isPlant, type Persona } from "./personas";
import { useHub } from "./store";

export type GuidePage = {
  title: string;
  now: string;
  doThis: string[];
  next: { label: string; to: string }[];
};

function page(path: string, user: Persona, pendingId?: string): GuidePage {
  const mgr = isManager(user);
  const plant = isPlant(user);
  const admin = isAdmin(user);

  if (path === "/login") {
    return {
      title: "Sign in",
      now: "Pick a lane. Each user opens a different Hub — corporate queue, plant SOP, or support desk.",
      doThis: ["Tap a person", "Continue to land on their Home"],
      next: [
        { label: "Corporate — Avinash", to: "/login" },
        { label: "Plant — Ramesh", to: "/login" },
        { label: "Support — Priya", to: "/login" },
      ],
    };
  }
  if (path === "/") {
    return {
      title: "Home",
      now: mgr
        ? "Your corporate landing. The red card is the live approval queue. Chips and shortcuts match HQ work."
        : plant
          ? "Shift landing. Sign the SOP before work, then punch, leave, or pay."
          : "Support landing. Open employee tickets, letters, and communities from here.",
      doThis: mgr
        ? ["Review the queue", "Open Admin if you need governance", "Ask Copilot about leave or credit"]
        : plant
          ? ["Open Knowledge Hub for CIP", "Punch attendance", "Check leave days"]
          : ["Open the ticket queue", "Jump to Communities", "Issue a letter"],
      next: mgr
        ? [
            { label: "Workspace queue", to: "/workspace" },
            { label: "Admin Console", to: "/admin" },
            { label: "Ask Copilot", to: "/copilot" },
          ]
        : plant
          ? [
              { label: "Knowledge / SOP", to: "/knowledge" },
              { label: "Attendance", to: "/services/attendance" },
              { label: "Payslips", to: "/workspace/payslips" },
            ]
          : [
              { label: "Ticket queue", to: "/workspace" },
              { label: "Communities", to: "/communities" },
              { label: "Letters", to: "/services/letters" },
            ],
    };
  }
  if (path === "/workspace") {
    return {
      title: "Workspace",
      now: mgr
        ? "Team requests sit here. Filter Pending → open a row → Approve, reject, or request changes."
        : "Your own tickets, leave, and documents. Nothing in the manager queue on this account.",
      doThis: mgr
        ? ["Tap a credit or leave row", "Use filters including Changes requested", "Open payslips at the bottom"]
        : ["Check ticket status", "Open payslips", "Submit leave from Services"],
      next: mgr
        ? [
            { label: pendingId ? `Open ${pendingId}` : "Queue", to: pendingId ? `/approvals/${pendingId}` : "/workspace" },
            { label: "Payslips", to: "/workspace/payslips" },
            { label: "Learning", to: "/learning" },
          ]
        : [
            { label: "Raise IT ticket", to: "/services/it" },
            { label: "Payslips", to: "/workspace/payslips" },
            { label: "Home", to: "/" },
          ],
    };
  }
  if (path.startsWith("/approvals/")) {
    return {
      title: "Approval",
      now: "One request. Read the summary, then Approve, Request changes, or Reject. The count on Home updates.",
      doThis: ["Approve to drop pending", "Request changes if papers are missing", "Back arrow returns to the queue"],
      next: [
        { label: "Back to queue", to: "/workspace" },
        { label: "Home", to: "/" },
      ],
    };
  }
  if (path === "/workspace/payslips") {
    return {
      title: "Payslips",
      now: `Official copies for ${user.fullName}. Net pay is ${user.nets}. Tap a month to download a demo file.`,
      doThis: ["Download a month", "Confirm the name matches this user"],
      next: [
        { label: "Workspace", to: "/workspace" },
        { label: "Leave", to: "/services/leave" },
      ],
    };
  }
  if (path === "/services") {
    return {
      title: "Services",
      now: "Catalog of HR, IT, and work hubs. Search or open a row — each form writes into this user’s record.",
      doThis: ["Request leave", "Raise an IT ticket", "Open Manufacturing Hub for plant SOPs"],
      next: [
        { label: "Leave", to: "/services/leave" },
        { label: "IT ticket", to: "/services/it" },
        { label: "Travel", to: "/services/travel" },
      ],
    };
  }
  if (path === "/services/leave") {
    return {
      title: "Request leave",
      now: `Balance on this account is ${user.leaveDays} days. Submit sends a Pending item to the corporate queue.`,
      doThis: ["Set dates", "Submit request", "Switch to Avinash to see it in Workspace"],
      next: [
        { label: "Workspace", to: "/workspace" },
        { label: "Leave policy", to: "/knowledge/pol-leave" },
      ],
    };
  }
  if (path === "/services/it") {
    return {
      title: "IT ticket",
      now: "Creates an INC in this user’s queue. Support (Priya) already has plant and HQ tickets assigned.",
      doThis: ["Add a summary (required)", "Submit for an INC number", "Track it in Workspace"],
      next: [
        { label: "Workspace", to: "/workspace" },
        { label: "ServiceNow app", to: "/apps/snow" },
      ],
    };
  }
  if (path === "/services/travel") {
    return {
      title: "Book travel",
      now: "Policy is on the card. Submit also creates a Travel approval for the manager.",
      doThis: ["Edit destination", "Open the travel policy", "Submit for approval"],
      next: [
        { label: "Travel policy", to: "/knowledge/pol-travel" },
        { label: "Workspace", to: "/workspace" },
      ],
    };
  }
  if (path.startsWith("/services/jobs")) {
    return {
      title: "Internal jobs",
      now: "Mobility roles. Apply stays on this user so you can show ‘Applied’.",
      doThis: ["Open a role", "Tap Apply once"],
      next: [{ label: "Services", to: "/services" }],
    };
  }
  if (path === "/services/letters") {
    return {
      title: "Letters",
      now: "HR letters for this employee. Support can demo this from Home.",
      doThis: ["Request employment / address / salary"],
      next: [{ label: "Support Home", to: "/" }],
    };
  }
  if (path === "/services/attendance") {
    return {
      title: "Attendance",
      now: `Punch source is ${user.location}. Plant users start here after the SOP.`,
      doThis: ["Read the month summary", "Return Home or open leave"],
      next: [
        { label: "Leave", to: "/services/leave" },
        { label: "Home", to: "/" },
      ],
    };
  }
  if (path === "/knowledge" || path.startsWith("/knowledge/")) {
    return {
      title: path === "/knowledge" ? "Knowledge" : "Document",
      now: plant
        ? "Plant SOP is pinned at the top. 1-tap sign, then acknowledge inside the document."
        : "Policies and SOPs. Bookmark or ask Copilot for a summary.",
      doThis: path === "/knowledge"
        ? ["Filter SOP / Policy", "Open Plant Safety", "Use AI summary on a doc"]
        : ["Bookmark", "Acknowledge", "Open a related doc"],
      next: [
        { label: "Plant Safety SOP", to: "/knowledge/sop-plant-safety" },
        { label: "Copilot", to: "/copilot" },
      ],
    };
  }
  if (path === "/copilot") {
    return {
      title: "Copilot",
      now: "Answers use this user’s leave days and whether they are a manager. Sources open Knowledge.",
      doThis: ["Ask leave balance", "Ask plant SOP", "Follow a source link"],
      next: [
        { label: "Leave policy", to: "/knowledge/pol-leave" },
        { label: "Home", to: "/" },
      ],
    };
  }
  if (path === "/admin") {
    return {
      title: "Admin Console",
      now: admin
        ? "Content governance. Confirm, archive, or send for approval — only this corporate admin can act."
        : "Restricted. Switch to Avinash on Profile to open governance.",
      doThis: admin ? ["Confirm an overdue policy", "Archive a doc"] : ["Open Profile", "Switch to Avinash"],
      next: admin
        ? [{ label: "Home", to: "/" }, { label: "Knowledge", to: "/knowledge" }]
        : [{ label: "Switch user", to: "/profile" }],
    };
  }
  if (path === "/profile") {
    return {
      title: "Profile",
      now: "Employee card plus Switch demo user. More links to Communities, Learning, and Analytics live here.",
      doThis: ["Switch lane", "Open Communities", "Change language for the tab bar"],
      next: [
        { label: "Communities", to: "/communities" },
        { label: "Learning", to: "/learning" },
        { label: "Sign in screen", to: "/login" },
      ],
    };
  }
  if (path === "/notifications") {
    return {
      title: "Notifications",
      now: "Inbox is unique to this user. Plant sees SOP reminders; corporate sees the approval stack.",
      doThis: ["Open a row", "Filter by category", "Mark all read"],
      next: [{ label: "Home", to: "/" }],
    };
  }
  if (path === "/apps" || path.startsWith("/apps/")) {
    return {
      title: path === "/apps" ? "All tools" : "App session",
      now: "SSO is simulated. Star favorites. Open keeps you in Hub with a snapshot — it does not bounce to Home.",
      doThis: ["Search an app", "Star ServiceNow or SAP", "Open the snapshot"],
      next: [{ label: "All tools", to: "/apps" }, { label: "Home", to: "/" }],
    };
  }
  if (path === "/news" || path.startsWith("/news/")) {
    return {
      title: "News",
      now: "Company feed. The Home hero opens the sustainability story (same article).",
      doThis: ["Open the hero story", "Mark as read"],
      next: [{ label: "Recognition", to: "/recognition" }, { label: "Home", to: "/" }],
    };
  }
  if (path === "/learning") {
    return {
      title: "Learning",
      now: `Progress starts from ${user.training}% for this person. Continue adds 20% per tap.`,
      doThis: ["Continue a required course"],
      next: [{ label: "Home", to: "/" }],
    };
  }
  if (path === "/communities") {
    return {
      title: "Communities",
      now: "Always available from Home, Profile, and Support shortcuts. Join / Leave is local to the session.",
      doThis: ["Join Run Club", "Leave a plant huddle"],
      next: [{ label: "Recognition", to: "/recognition" }, { label: "Home", to: "/" }],
    };
  }
  if (path === "/recognition") {
    return {
      title: "Recognition",
      now: "Post kudos as the signed-in user. Feed is shared.",
      doThis: ["Write a note", "Post"],
      next: [{ label: "Home", to: "/" }],
    };
  }
  if (path === "/search") {
    return {
      title: "Search",
      now: "Finds policies, news, people (all three demo users), and apps. AI overview respects this role.",
      doThis: ["Try “Ramesh” or “leave policy”"],
      next: [{ label: "Copilot", to: "/copilot" }],
    };
  }
  if (path === "/analytics" || path === "/sales" || path === "/manufacturing" || path === "/supply-chain") {
    return {
      title: path === "/analytics" ? "Analytics" : "Work hub",
      now: "Deep links from Services. Manufacturing Hub is the plant shortcut to SOP and tickets.",
      doThis: ["Open a linked SOP or app"],
      next: [{ label: "Services", to: "/services" }, { label: "Knowledge", to: "/knowledge" }],
    };
  }
  return {
    title: "HCCB Hub",
    now: "Move with the tab bar or the arrows on either side of the phone.",
    doThis: ["Open Home"],
    next: [{ label: "Home", to: "/" }],
  };
}

function titleOf(path: string) {
  if (path === "/") return "Home";
  if (path === "/login") return "Sign in";
  const bit = path.split("/").filter(Boolean)[0];
  const names: Record<string, string> = {
    workspace: "Workspace",
    approvals: "Approval",
    services: "Services",
    knowledge: "Knowledge",
    copilot: "Copilot",
    admin: "Admin",
    profile: "Profile",
    notifications: "Alerts",
    apps: "Tools",
    news: "News",
    learning: "Learning",
    communities: "Communities",
    recognition: "Recognition",
    search: "Search",
    analytics: "Analytics",
    sales: "Sales Hub",
    manufacturing: "Plant Hub",
    "supply-chain": "Supply Hub",
  };
  return names[bit ?? ""] ?? "Hub";
}

export function GuideStage({ children }: { children: ReactNode }) {
  const loc = useLocation();
  const nav = useNavigate();
  const { user, ready, state } = useHub();
  const [trail, setTrail] = useState<{ path: string; title: string }[]>(() => {
    try {
      const raw = sessionStorage.getItem("hccb-guide-trail");
      if (raw) return JSON.parse(raw) as { path: string; title: string }[];
    } catch {
      /* ignore */
    }
    return [];
  });
  const pendingId = state.approvals.find((a) => a.status === "Pending")?.id;
  const guide = page(loc.pathname, user, pendingId);
  const here = { path: loc.pathname, title: titleOf(loc.pathname) };
  const shown = [...trail.filter((x) => x.path !== loc.pathname), here].slice(-4);
  const back = shown.length > 1 ? shown[shown.length - 2] : null;

  useEffect(() => {
    setTrail(shown);
    try {
      sessionStorage.setItem("hccb-guide-trail", JSON.stringify(shown));
    } catch {
      /* ignore */
    }
  }, [loc.pathname, user.id]);

  return (
    <div className="stage">
      <aside className="rail rail-left">
        {ready && (
          <>
            <div className="rail-kicker">Came from</div>
            <div className="rail-trail">
              {shown.length === 0 && <span className="rail-muted">Start in the phone →</span>}
              {shown.map((step, i) => (
                <span key={step.path + i} className="rail-step">
                  {i > 0 && (
                    <span className="rail-arrow" aria-hidden>
                      →
                    </span>
                  )}
                  <button
                    className={step.path === loc.pathname ? "rail-chip on" : "rail-chip"}
                    onClick={() => nav(step.path)}
                  >
                    {step.title}
                  </button>
                </span>
              ))}
            </div>
            {back && loc.pathname !== "/" && loc.pathname !== "/login" && (
              <button className="rail-back" onClick={() => nav(back.path)}>
                <Icon name="arrow_back" size={18} />
                Back to {back.title}
              </button>
            )}
            <div className="rail-kicker" style={{ marginTop: 22 }}>
              You are here
            </div>
            <h2 className="rail-title">{guide.title}</h2>
            <p className="rail-body">{guide.now}</p>
            <div className="rail-kicker">On this screen</div>
            <ul className="rail-list">
              {guide.doThis.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
            <div className="rail-pointer" aria-hidden>
              →
            </div>
          </>
        )}
      </aside>
      {children}
      <aside className="rail rail-right">
        {ready && (
          <>
            <div className="rail-pointer left" aria-hidden>
              ←
            </div>
            <div className="rail-kicker">Go next</div>
            <p className="rail-body" style={{ marginBottom: 12 }}>
              {user.lane} · {user.firstName}
            </p>
            <div className="rail-next">
              {guide.next.map((n) => (
                <button key={n.to + n.label} className="rail-go" onClick={() => nav(n.to)}>
                  <span>{n.label}</span>
                  <Icon name="arrow_forward" size={18} />
                </button>
              ))}
            </div>
            <div className="rail-kicker" style={{ marginTop: 22 }}>
              Tabs
            </div>
            <p className="rail-body">
              Bottom bar: Home, Workspace, Services, Copilot, Knowledge. Header icons: Search, alerts, profile.
            </p>
          </>
        )}
      </aside>
    </div>
  );
}

export function PathStrip() {
  const loc = useLocation();
  const nav = useNavigate();
  const { user, state } = useHub();
  const pendingId = state.approvals.find((a) => a.status === "Pending")?.id;
  const guide = page(loc.pathname, user, pendingId);
  const canBack = loc.pathname !== "/";
  const go = guide.next[0];
  return (
    <div className="path-strip">
      <button
        className={canBack ? "path-back" : "path-back ghost"}
        aria-label={canBack ? "Go back" : "Home"}
        onClick={() => (canBack ? nav(-1) : nav("/"))}
      >
        <Icon name="chevron_left" size={18} />
      </button>
      <div className="path-now">
        <b>{guide.title}</b>
        <span>{guide.doThis[0]}</span>
      </div>
      {go && (
        <button className="path-nudge" aria-label={go.label} onClick={() => nav(go.to)}>
          <Icon name="arrow_forward" size={18} />
        </button>
      )}
    </div>
  );
}
