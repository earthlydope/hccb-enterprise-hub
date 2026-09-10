import { useEffect, useRef, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { isAdmin, isManager, isPlant, type Persona } from "./personas";
import { useHub } from "./store";

type HintCopy = { title: string; body: string };

function hintFor(
  id: string,
  user: Persona,
  pendingCount: number,
  unread: number,
): HintCopy | null {
  const mgr = isManager(user);
  const plant = isPlant(user);
  const admin = isAdmin(user);

  const table: Record<string, HintCopy> = {
    "login-avinash": {
      title: "Corporate + Admin",
      body: "HQ Home with the live approval queue and Admin Console.",
    },
    "login-ramesh": {
      title: "Plant floor",
      body: "Shift Home: sign CIP SOP, then punch, leave, and pay.",
    },
    "login-priya": {
      title: "Employee support",
      body: "Shared Services Home: tickets, letters, and communities.",
    },
    "login-go": { title: "Enter the Hub", body: "Opens that person’s Home — queues and tools follow the lane." },
    "nav-search": { title: "Search", body: "Find policies, people, news, and apps across the Hub." },
    "nav-alerts": {
      title: "Notifications",
      body: unread ? `${unread} unread for ${user.firstName}.` : "Inbox is unique to this signed-in user.",
    },
    "nav-profile": { title: "Profile", body: "Employee card, switch demo user, language, communities." },
    "nav-back": { title: "Back", body: "Returns to the previous screen in this flow." },
    "tab-Home": { title: "Home", body: "Landing for this lane — queue, SOP, or support desk." },
    "tab-Workspace": {
      title: "Workspace",
      body: mgr ? "Team credit, travel, and leave to approve." : "Your tickets, leave, and payslips.",
    },
    "tab-Services": { title: "Services", body: "Request leave, travel, letters, IT, and work hubs." },
    "tab-AI Copilot": { title: "AI Copilot", body: "Answers use this user’s leave days and whether they manage a queue." },
    "tab-Knowledge": {
      title: "Knowledge",
      body: plant ? "Plant Safety SOP is pinned for 1-tap sign-off." : "Policies and SOPs. Bookmark or ask Copilot.",
    },
    "home-admin": { title: "Admin Console", body: admin ? "Governance: confirm, archive, send for approval." : "Restricted to the corporate admin persona." },
    "home-review": {
      title: "Approval queue",
      body: `${pendingCount} pending — credit, travel, and leave from the plants and field.`,
    },
    "home-sop": { title: "Required SOP", body: "Open Knowledge and sign chemical / CIP safety before the shift." },
    "home-tickets": { title: "Support queue", body: "Employee tickets assigned to Shared Services." },
    "home-leave": { title: "Leave", body: `${user.leaveDays} days on this account. Submit sends a request to the manager.` },
    "home-train": { title: "Learning", body: `Required modules sit at ${user.training}% for ${user.firstName}.` },
    "home-gov": { title: "Governance", body: "Overdue policies for Admin Console." },
    "home-punch": { title: "Attendance", body: `Punch source is ${user.location}.` },
    "home-letters": { title: "Letters", body: "Employment, address, and salary letters for this employee." },
    "home-communities": { title: "Communities", body: "Plant huddles, support desk, run club — join stays on this user." },
    "home-copilot": { title: "Ask Copilot", body: "Plain-language leave, SOP, and ticket answers with sources." },
    "home-news": { title: "Leadership news", body: "Same sustainability story as the News feed hero." },
    "home-apps": { title: "All tools", body: "SSO is simulated. Open stays inside the Hub." },
    "qa-workspace": { title: "Review queue", body: "Opens Workspace so you can approve or request changes." },
    "qa-leave": { title: "Request leave", body: "Dates + submit → Pending on the corporate queue." },
    "qa-travel": { title: "Book travel", body: "Creates a Travel approval for the manager." },
    "qa-payslips": { title: "Payslips", body: `Official copies for ${user.fullName}.` },
    "qa-admin": { title: "Admin", body: "Content governance for the corporate admin." },
    "qa-attendance": { title: "Punch", body: "Month summary and last punch for this plant user." },
    "qa-knowledge": { title: "Plant SOP", body: "Jump to Knowledge Hub and sign CIP." },
    "qa-it": { title: "IT ticket", body: "Opens an INC on this user’s record." },
    "qa-letters": { title: "Employee letters", body: "HR letters support can issue from Home." },
    "qa-communities": { title: "Communities", body: "Join or leave groups for this session." },
    "qa-tickets": { title: "Ticket queue", body: "Assigned employee tickets in Workspace." },
    "sys-sap": { title: "SAP ERP", body: "Ops and supply snapshot — stays in Hub, no bounce to Home." },
    "sys-crm": { title: "Sales CRM", body: "Field and outlet snapshot for commercial." },
    "sys-pbi": { title: "Power BI", body: "Line OEE or commercial BI, depending on lane." },
    "sys-hr": { title: "HR Portal", body: "People, letters, and employee services." },
    "sys-snow": { title: "ServiceNow", body: "Plant or employee tickets through the Hub." },
    "sys-lms": { title: "LMS", body: "Safety and required learning modules." },
    "sys-teams": { title: "Teams", body: "Support huddles — launch stays in Hub." },
    "ws-pending": {
      title: mgr ? "Pending count" : "Open work",
      body: mgr ? `${pendingCount} items waiting on you.` : "Your tickets or leave on this account.",
    },
    "ws-leave": { title: "Leave", body: `${user.leaveDays} days remaining.` },
    "ws-paystat": { title: "Net pay", body: `Last credited ${user.nets}. Open payslips below.` },
    "ws-filters": { title: "Filters", body: "Pending, approved, rejected, or changes requested." },
    "ws-row": { title: "Open request", body: "Read the summary, then Approve, reject, or request changes." },
    "ws-payslips": { title: "Payslips", body: "Download a demo month for this employee." },
    "ws-training": { title: "Training", body: `Continue from ${user.training}%.` },
    "appr-approve": { title: "Approve", body: "Clears this item; Home pending count drops." },
    "appr-changes": { title: "Request changes", body: "Keeps the item in Workspace under Changes requested." },
    "appr-reject": { title: "Reject", body: "Closes the request as Rejected." },
    "svc-leave": { title: "Request Leave", body: "Writes into this user and the manager queue." },
    "svc-payslip": { title: "Payslips", body: "Authorized copies for the signed-in name." },
    "svc-letters": { title: "Employee letters", body: "Employment / address / salary — support demo." },
    "svc-travel": { title: "Book Travel", body: "Policy on the card; submit creates an approval." },
    "svc-attendance": { title: "Attendance", body: "Plant punch and month summary." },
    "svc-it": { title: "Raise IT Ticket", body: "Creates an INC. Priya already has plant and HQ tickets." },
    "svc-mfg": { title: "Manufacturing Hub", body: "Plant shortcut to SOP and tickets." },
    "leave-submit": { title: "Submit leave", body: "Pending for Avinash. Switch user in Profile to see the queue." },
    "it-submit": { title: "Submit ticket", body: "Gives an INC number you can track in Workspace." },
    "travel-submit": { title: "Submit travel", body: "Creates a Travel approval for the manager." },
    "kn-sop": { title: "1-tap SOP", body: "Required before shift on the plant account." },
    "kn-sop-filter": { title: "SOP filter", body: "Show only operating procedures." },
    "kn-doc": { title: "Open document", body: "Bookmark, acknowledge, or ask Copilot for a summary." },
    "kn-ack": { title: "Acknowledge", body: "Records that this user read the SOP." },
    "kn-ai": { title: "AI summary", body: "Sends this title to Copilot with sources." },
    "copilot-new": { title: "New chat", body: "Clears this user’s Copilot thread." },
    "copilot-ask": { title: "Ask", body: "Role-aware answer; sources open Knowledge." },
    "copilot-starter": { title: "Suggested ask", body: "Runs a demo question using this user’s data." },
    "profile-admin": { title: "Admin Console", body: "Only the corporate admin can act on governance." },
    "profile-switch": { title: "Switch user", body: "Loads that lane’s Home, tickets, and leave." },
    "admin-confirm": { title: "Confirm policy", body: "Marks governance Published for the audit trail." },
    "pay-download": { title: "Download", body: "Demo file named for this employee." },
  };

  return table[id] ?? null;
}

type Spot = { id: string; t: DOMRect; s: DOMRect };

export function HintStage({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const hold = useRef<HTMLElement | null>(null);
  const [spot, setSpot] = useState<Spot | null>(null);
  const loc = useLocation();
  const { user, pendingCount, unread } = useHub();

  const measure = (el: HTMLElement) => {
    const root = ref.current;
    if (!root) return;
    hold.current = el;
    setSpot({ id: el.dataset.hint ?? "", t: el.getBoundingClientRect(), s: root.getBoundingClientRect() });
  };

  const find = (n: EventTarget | null) => {
    const root = ref.current;
    if (!(n instanceof Element) || !root) return null;
    const el = n.closest("[data-hint]");
    if (el instanceof HTMLElement && el.dataset.hint && root.contains(el)) return el;
    return null;
  };

  useEffect(() => {
    setSpot(null);
    hold.current = null;
  }, [loc.pathname]);

  useEffect(() => {
    const onScroll = () => {
      if (hold.current && ref.current?.contains(hold.current)) measure(hold.current);
      else setSpot(null);
    };
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const copy = spot ? hintFor(spot.id, user, pendingCount, unread) : null;

  return (
    <div
      className="stage"
      ref={ref}
      onMouseOver={(e) => {
        const el = find(e.target);
        if (el) measure(el);
      }}
      onMouseOut={(e) => {
        const from = find(e.target);
        const to = find(e.relatedTarget);
        if (from && from !== to) {
          if (to) measure(to);
          else {
            hold.current = null;
            setSpot(null);
          }
        }
      }}
    >
      {children}
      {spot && copy && <HintPaint spot={spot} copy={copy} />}
    </div>
  );
}

function HintPaint({ spot, copy }: { spot: Spot; copy: HintCopy }) {
  const { t, s } = spot;
  const sw = s.width;
  const sh = s.height;
  const tx = t.left - s.left;
  const ty = t.top - s.top;
  const tcx = tx + t.width / 2;
  const tcy = ty + t.height / 2;
  const cardW = Math.min(236, Math.max(176, sw * 0.18));
  const cardH = 92;
  const gutter = 20;
  const side: "left" | "right" = tcx < sw / 2 ? "left" : "right";
  const cx = side === "left" ? gutter : sw - gutter - cardW;
  const cy = Math.min(Math.max(gutter, tcy - cardH / 2), sh - cardH - gutter);
  const startX = side === "left" ? cx + cardW - 4 : cx + 4;
  const startY = cy + 36;
  const endX = side === "left" ? tx - 8 : tx + t.width + 8;
  const endY = tcy;
  const span = endX - startX;
  const bow = Math.max(48, Math.min(96, Math.abs(span) * 0.42));
  const lift = (endY < sh / 2 ? 1 : -1) * bow;
  const d = `M ${startX} ${startY} C ${startX + span * 0.3} ${startY + lift}, ${endX - span * 0.15} ${endY + lift * 0.35}, ${endX} ${endY}`;

  return (
    <div className="hint-layer" aria-hidden>
      <div
        className="hint-spot"
        style={{ left: tx, top: ty, width: t.width, height: t.height }}
      />
      <svg className="hint-svg" viewBox={`0 0 ${sw} ${sh}`} width={sw} height={sh}>
        <defs>
          <marker id="hint-head" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">
            <path d="M0 0 L9 4.5 L0 9 Z" fill="#f40009" />
          </marker>
        </defs>
        <path className="hint-curve" pathLength={1} d={d} markerEnd="url(#hint-head)" />
      </svg>
      <div className="hint-card on" style={{ left: cx, top: cy, width: cardW }}>
        <b>{copy.title}</b>
        <span>{copy.body}</span>
      </div>
    </div>
  );
}
