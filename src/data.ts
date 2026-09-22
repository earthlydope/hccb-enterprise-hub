export type ApprovalStatus = "Pending" | "Approved" | "Rejected" | "Changes requested";

export type Approval = {
  id: string;
  type: "Distributor Credit" | "Travel" | "Leave" | "Purchase" | "HR Workflow";
  title: string;
  requester: string;
  requesterRole: string;
  amount?: string;
  submitted: string;
  summary: string;
  status: ApprovalStatus;
  details: string[];
};

export const initialApprovals: Approval[] = [
  {
    id: "APR-10430",
    type: "Distributor Credit",
    title: "Sri Lakshmi Enterprises credit",
    requester: "Commercial Sales Lead",
    requesterRole: "Plant 204",
    amount: "₹4,50,000",
    submitted: "Today, 7:40 AM",
    summary: "Distributor credit request for Sri Lakshmi Enterprises.",
    status: "Pending",
    details: ["Requested ₹4,50,000", "Bank guarantee on file", "Plant 204"],
  },
  {
    id: "APR-10421",
    type: "Distributor Credit",
    title: "Credit limit increase — Metro Beverages",
    requester: "Rohit Nair",
    requesterRole: "Territory Manager",
    amount: "₹4.8 L",
    submitted: "Today, 9:12 AM",
    summary: "Request to raise distributor credit from ₹12L to ₹16.8L for Q3 peak.",
    status: "Pending",
    details: ["Current limit ₹12,00,000", "Proposed ₹16,80,000", "DSO 28 days", "No overdue invoices"],
  },
  {
    id: "APR-10418",
    type: "Distributor Credit",
    title: "Temporary credit — Sunrise Agencies",
    requester: "Meera Iyer",
    requesterRole: "Area Sales Manager",
    amount: "₹2.1 L",
    submitted: "Today, 8:40 AM",
    summary: "Festival stocking support for 21 days.",
    status: "Pending",
    details: ["Duration 21 days", "Auto-revert after period", "Risk rating: Low"],
  },
  {
    id: "APR-10411",
    type: "Distributor Credit",
    title: "Credit note — Coastal Distributors",
    requester: "Arjun Patel",
    requesterRole: "Key Account",
    amount: "₹86,400",
    submitted: "Yesterday",
    summary: "Damaged stock credit note against invoice INV-88321.",
    status: "Pending",
    details: ["Invoice INV-88321", "QA verified 144 cases", "Photo evidence attached"],
  },
  {
    id: "APR-10392",
    type: "Travel",
    title: "Hyderabad market visit — 12 Sep",
    requester: "Kavya Reddy",
    requesterRole: "Field Sales Executive",
    amount: "₹18,600",
    submitted: "Yesterday",
    summary: "Overnight stay and local travel for outlet blitz.",
    status: "Pending",
    details: ["BLR → HYD return", "1 night hotel", "Policy band: Standard"],
  },
  {
    id: "APR-10388",
    type: "Travel",
    title: "Chennai distributor meet",
    requester: "Sanjay Menon",
    requesterRole: "ASM",
    amount: "₹24,150",
    submitted: "2 days ago",
    summary: "Team offsite with 4 distributors.",
    status: "Pending",
    details: ["3 nights", "Client entertainment ₹4,000", "Within policy"],
  },
  {
    id: "APR-LEAVE-RK",
    type: "Leave",
    title: "Privilege leave — Ramesh Kumar",
    requester: "Ramesh Kumar",
    requesterRole: "Production Line #2",
    submitted: "Today, 8:10 AM",
    summary: "3 days PL for sibling wedding in Mysore. Shift relief with S. Prakash.",
    status: "Pending",
    details: ["April 4–6", "Privilege Leave", "Relief: S. Prakash"],
  },
  {
    id: "APR-EXP-SV",
    type: "Travel",
    title: "Hubballi plant audit claim — Sunita Verma",
    requester: "Sunita Verma",
    requesterRole: "Regional Auditor",
    amount: "₹8,450",
    submitted: "Today, 9:00 AM",
    summary: "Cab and hotel GST invoices for Hubballi plant audit.",
    status: "Pending",
    details: ["3 GST invoices", "Policy verified", "Route: Hubballi"],
  },
];

export type Ticket = {
  id: string;
  title: string;
  category: string;
  priority: "Low" | "Medium" | "High";
  status: "Open" | "In progress" | "Resolved";
  updated: string;
  note?: string;
};

export const initialTickets: Ticket[] = [
  {
    id: "INC-20918",
    title: "VPN timeout on plant Wi-Fi",
    category: "Network",
    priority: "High",
    status: "In progress",
    updated: "1h ago",
  },
  {
    id: "INC-20844",
    title: "SAP T-code authorization",
    category: "Access",
    priority: "Medium",
    status: "Open",
    updated: "Yesterday",
  },
];

export type LeaveRequest = {
  id: string;
  type: string;
  from: string;
  to: string;
  days: number;
  note: string;
  status: "Submitted" | "Approved" | "Rejected";
};

export const initialLeaves: LeaveRequest[] = [
  {
    id: "LV-3312",
    type: "Casual Leave",
    from: "18 Sep 2026",
    to: "19 Sep 2026",
    days: 2,
    note: "Family function",
    status: "Approved",
  },
];

export const knowledgeDocs = [
  {
    id: "sop-plant-safety",
    title: "Plant Safety SOP — Bengaluru",
    type: "SOP",
    department: "Manufacturing",
    owner: "Operations",
    version: "v4.2",
    updated: "12 Aug 2026",
    reviewed: "12 Aug 2026",
    source: "SharePoint",
    snippet: "Mandatory PPE, lockout-tagout, near-miss reporting and visitor escort rules for Bengaluru Plant.",
    body: [
      "All personnel must wear approved PPE in production and warehouse zones.",
      "Lockout-tagout is required before any equipment intervention.",
      "Near misses must be logged in the safety app within 2 hours.",
      "Visitors require a plant escort and induction badge.",
      "Emergency assembly point is Gate 2 parking bay.",
    ],
    related: ["pol-travel", "sop-warehouse"],
  },
  {
    id: "pol-travel",
    title: "Domestic Travel Policy",
    type: "Policy",
    department: "HR",
    owner: "HR Team",
    version: "v3.1",
    updated: "02 Jul 2026",
    reviewed: "02 Jul 2026",
    source: "HR Documents",
    snippet: "Booking windows, class of travel, per-diem and claim timelines for domestic trips.",
    body: [
      "Air travel is permitted for one-way journeys over 400 km.",
      "Economy class is default. Manager approval needed for any exception.",
      "Hotel caps: Metro ₹6,500 / Non-metro ₹4,500 per night.",
      "Claims must be submitted within 7 days of trip completion.",
      "Personal side trips cannot be billed to HCCB.",
    ],
    related: ["pol-leave", "sop-plant-safety"],
  },
  {
    id: "pol-leave",
    title: "Leave & Attendance Policy",
    type: "Policy",
    department: "HR",
    owner: "HR Team",
    version: "v5.0",
    updated: "18 Jan 2026",
    reviewed: "18 Jan 2026",
    source: "HR Documents",
    snippet: "Casual, earned and sick leave balances, sandwich rule and manager SLAs.",
    body: [
      "Casual leave: 12 days per calendar year.",
      "Earned leave accrues monthly and can be encashed as per HR calendar.",
      "Sick leave beyond 2 days requires a medical certificate.",
      "Apply at least 3 working days in advance for planned leave.",
      "Managers must action requests within 48 hours.",
    ],
    related: ["pol-travel"],
  },
  {
    id: "playbook-q3",
    title: "Q3 Sales Playbook — Sparkling",
    type: "Playbook",
    department: "Sales",
    owner: "Sales Excellence",
    version: "v1.6",
    updated: "28 Aug 2026",
    reviewed: "28 Aug 2026",
    source: "Knowledge Articles",
    snippet: "Outlet execution standards, cooler placement and festival pack priorities.",
    body: [
      "Priority SKUs: 600ml PET, 1.25L PET and 250ml RGB.",
      "Cooler planogram must show hero SKUs at eye level.",
      "Festival combo must be merchandised 10 days before Navratri.",
      "Perfect store audit target: 92% for urban beat.",
    ],
    related: ["sop-plant-safety"],
  },
  {
    id: "sop-warehouse",
    title: "Warehouse Handling SOP",
    type: "SOP",
    department: "Supply Chain",
    owner: "Operations",
    version: "v2.8",
    updated: "04 Jun 2026",
    reviewed: "04 Jun 2026",
    source: "SharePoint",
    snippet: "FEFO, damaged stock quarantine and loading bay safety.",
    body: [
      "Follow FEFO for all finished goods.",
      "Damaged cases go to quarantine bay Q-2 with photo evidence.",
      "No loading during rain without canopy confirmation.",
    ],
    related: ["sop-plant-safety"],
  },
  {
    id: "onboard-fso",
    title: "Field Sales Onboarding Pack",
    type: "HR Document",
    department: "Sales",
    owner: "HR Team",
    version: "v2.0",
    updated: "11 Mar 2026",
    reviewed: "11 Mar 2026",
    source: "OneDrive",
    snippet: "First 30-day checklist, DMS access, beat plan and compliance modules.",
    body: [
      "Day 1: ID, laptop, DMS and CRM access.",
      "Week 1: Ride-along with ASM and safety briefing.",
      "Day 30: Certification on Perfect Store and credit policy.",
    ],
    related: ["pol-leave", "playbook-q3"],
  },
];

export const newsItems = [
  {
    id: "n1",
    title: "HCCB Sustainability Milestone 2025: 100% Water Positivity",
    category: "Leadership",
    read: "4 min",
    time: "Published today",
    body: "South Region units are at zero-waste-to-landfill. Every plant is water-positive for 2025. Thank you to operations, EHS, and the bottling partners who closed the last gaps this quarter.",
  },
  {
    id: "n2",
    title: "CEO note: Safety first this festive season",
    category: "Leadership",
    read: "3 min",
    time: "2h ago",
    body: "As volumes ramp up, keep PPE discipline and no shortcuts on loading bays. Thank you for protecting each other.",
  },
  {
    id: "n3",
    title: "Bengaluru Plant hits 30 days zero-loss-time",
    category: "Plant",
    read: "2 min",
    time: "Yesterday",
    body: "Operations and EHS teams closed a 30-day streak. Recognition event at 4 PM in the canteen.",
  },
  {
    id: "n4",
    title: "New internal jobs: Territory Manager — East",
    category: "HR",
    read: "4 min",
    time: "2 days ago",
    body: "Applications close 20 Sep. Eligibility: 4+ years in modern trade or general trade.",
  },
];

export const learningCourses = [
  { id: "c1", title: "Code of Business Conduct", due: "15 Sep", progress: 100, required: true },
  { id: "c2", title: "Defensive driving — field", due: "22 Sep", progress: 72, required: true },
  { id: "c3", title: "Credit policy refresh", due: "30 Sep", progress: 40, required: true },
  { id: "c4", title: "Coach the beat — advanced", due: "Optional", progress: 0, required: false },
];

export const jobs = [
  {
    id: "j1",
    title: "Territory Manager — East",
    location: "Kolkata",
    type: "Full-time",
    eligibility: "4+ years GT/MT",
  },
  {
    id: "j2",
    title: "Plant EHS Specialist",
    location: "Bengaluru Plant",
    type: "Full-time",
    eligibility: "NEBOSH or equivalent",
  },
  {
    id: "j3",
    title: "Sales Capability Coach",
    location: "Hyderabad",
    type: "Full-time",
    eligibility: "Internal applicants preferred",
  },
];

export const apps = [
  { id: "sap", name: "SAP ERP", subtitle: "Ops & Supply", color: "#FCE8E6", accent: "#C5221F", initials: "SAP" },
  { id: "crm", name: "Sales CRM", subtitle: "Field & Outlets", color: "#FEF7E0", accent: "#B06000", initials: "CRM" },
  { id: "dms", name: "DMS", subtitle: "Distributor Mgmt", color: "#E8F0FE", accent: "#1967D2", initials: "DMS" },
  { id: "pbi", name: "Power BI", subtitle: "Analytics", color: "#F3E8FD", accent: "#7627BB", initials: "PBI" },
  { id: "snow", name: "ServiceNow", subtitle: "IT & Tickets", color: "#E6F4EA", accent: "#137333", initials: "SN" },
  { id: "lms", name: "LMS", subtitle: "Learning", color: "#E8F0FE", accent: "#185ABC", initials: "LMS" },
  { id: "hr", name: "HR Portal", subtitle: "People", color: "#FCE8E6", accent: "#A50E0E", initials: "HR" },
  { id: "teams", name: "Microsoft Teams", subtitle: "Collaborate", color: "#E8F0FE", accent: "#5B5FC7", initials: "MS" },
];

export const services = [
  { id: "leave", name: "Request Leave", icon: "calendar_month", to: "/services/leave", group: "HR" },
  { id: "payslip", name: "Payslips", icon: "payments", to: "/workspace/payslips", group: "HR" },
  { id: "letters", name: "Employee Letters", icon: "description", to: "/services/letters", group: "HR" },
  { id: "jobs", name: "Internal Jobs", icon: "work", to: "/services/jobs", group: "HR" },
  { id: "travel", name: "Book Travel", icon: "flight", to: "/services/travel", group: "HR" },
  { id: "attendance", name: "Attendance", icon: "schedule", to: "/services/attendance", group: "HR" },
  { id: "it", name: "Raise IT Ticket", icon: "computer", to: "/services/it", group: "IT" },
  { id: "status", name: "My Requests", icon: "list_alt", to: "/workspace", group: "IT" },
  { id: "sales", name: "Sales Hub", icon: "storefront", to: "/sales", group: "Work" },
  { id: "mfg", name: "Manufacturing Hub", icon: "factory", to: "/manufacturing", group: "Work" },
  { id: "sc", name: "Supply Chain Hub", icon: "local_shipping", to: "/supply-chain", group: "Work" },
];

export const communities = [
  { id: "g1", name: "Bengaluru Plant", members: "1,204", last: "Safety huddle notes posted" },
  { id: "g2", name: "Field Sales South", members: "860", last: "Festival combo photos" },
  { id: "g3", name: "HCCB Run Club", members: "312", last: "Sunday 6 AM Cubbon" },
];

export const recognitionFeed = [
  { id: "r1", from: "Avinash B M", to: "Chittoor Line 2", text: "Clean CIP handover two nights running. Line 2 is setting the standard.", when: "Today" },
  { id: "r2", from: "EHS Team", to: "Plant teams", text: "30 days LTI-free at Bengaluru. Proud of the floor teams.", when: "Yesterday" },
];

export const governanceItems = [
  { id: "g-1", title: "Domestic Travel Policy", owner: "HR Team", due: "12 Oct 2026", health: "On track" },
  { id: "g-2", title: "Plant Safety SOP — Bengaluru", owner: "Operations", due: "20 Sep 2026", health: "Due soon" },
  { id: "g-3", title: "Credit Policy 2025", owner: "Finance", due: "08 Sep 2026", health: "Overdue" },
  { id: "g-4", title: "Warehouse Handling SOP", owner: "Operations", due: "04 Dec 2026", health: "On track" },
];

export const analyticsCards = [
  { id: "a1", title: "South volume vs plan", value: "104%", hint: "MTD sparkling", tone: "good" },
  { id: "a2", title: "Perfect store", value: "91%", hint: "Urban beat", tone: "good" },
  { id: "a3", title: "Plant OEE", value: "78%", hint: "Bengaluru L2", tone: "warn" },
  { id: "a4", title: "Open tickets", value: "2", hint: "Your IT queue", tone: "bad" },
];

import type { Persona } from "./personas";
import { isManager } from "./personas";

export function copilotAnswer(query: string, user?: Persona, pending = 0) {
  const q = query.toLowerCase();
  const days = user?.leaveDays ?? 12;
  if (q.includes("ceo") || q.includes("ama") || q.includes("ask me anything") || q.includes("townhall") || q.includes("town hall")) {
    return {
      answer:
        "CEO Talks — Ask Me Anything runs on 24 Sep at 3:00 PM IST on Teams Live. Questions are open now: the most upvoted ones are answered live, the rest get a written reply within a week. You can ask anonymously.",
      sources: [],
      actions: [
        { label: "Ask the CEO", to: "/ceo-talks" },
        { label: "Read the townhall notice", to: "/announcements/ann-townhall" },
      ],
    };
  }
  if (q.includes("announce") || q.includes("notice") || q.includes("popup") || q.includes("circular")) {
    const live = user ? liveAnnouncementsFor(user) : [];
    const critical = live.filter((a) => a.priority === "Critical").length;
    return {
      answer: user
        ? `You have ${live.length} announcements targeted to ${user.department} at ${user.location}${critical ? `, ${critical} of them critical and needing acknowledgement` : ""}. The festive safety stand-down and the 24 Sep payroll cut-off are the two to act on.`
        : "Important announcements are on Home, filtered to your department and location.",
      sources: [],
      actions: [{ label: "Open announcements", to: "/announcements" }],
    };
  }
  if (q.includes("travel")) {
    return {
      answer:
        "Domestic travel: economy by default, hotel cap ₹6,500 in metros, submit claims within 7 days. Trips over 400 km one-way can be flown.",
      sources: ["pol-travel"],
      actions: [
        { label: "Open travel policy", to: "/knowledge/pol-travel" },
        { label: "Book travel", to: "/services/travel" },
      ],
    };
  }
  if (q.includes("leave") || q.includes("transfer")) {
    return {
      answer: `${user?.firstName ? user.firstName + ", you" : "You"} have ${days} leave days on file. Apply 3 working days in advance. Managers must action within 48 hours. Internal transfers go through HR Services with manager endorsement.`,
      sources: ["pol-leave"],
      actions: [
        { label: "Request leave", to: "/services/leave" },
        { label: "Open leave policy", to: "/knowledge/pol-leave" },
      ],
    };
  }
  if (q.includes("sales") || q.includes("target") || q.includes("q4") || q.includes("q3")) {
    return {
      answer:
        "Q3 sparkling playbook is live: hero SKUs 600ml / 1.25L / 250ml RGB. Perfect store target 92% urban. South MTD volume is 104% of plan.",
      sources: ["playbook-q3"],
      actions: [
        { label: "Open playbook", to: "/knowledge/playbook-q3" },
        { label: "Sales Hub", to: "/sales" },
      ],
    };
  }
  if (q.includes("onboard") || q.includes("joining") || q.includes("document")) {
    return {
      answer:
        "Field Sales onboarding pack covers DMS/CRM access, ride-along, and Day-30 Perfect Store certification. Plant joining packs start with the Safety SOP.",
      sources: ["onboard-fso"],
      actions: [{ label: "Open onboarding pack", to: "/knowledge/onboard-fso" }],
    };
  }
  if (q.includes("safety") || q.includes("sop") || q.includes("ppe") || q.includes("cip")) {
    return {
      answer:
        "Plant Safety SOP v4.2: PPE in all production zones, LOTO before intervention, near-miss within 2 hours, assembly at Gate 2. Chittoor Line 2 also requires CIP dual lockout.",
      sources: ["sop-plant-safety"],
      actions: [{ label: "Open SOP", to: "/knowledge/sop-plant-safety" }],
    };
  }
  if (q.includes("approval") || q.includes("credit")) {
    if (user && isManager(user)) {
      return {
        answer: `You have ${pending} pending items in Workspace — distributor credit, travel, and leave from the South Zone queue.`,
        sources: [],
        actions: [{ label: "Review in Workspace", to: "/workspace" }],
      };
    }
    return {
      answer:
        "Credit and travel approvals sit with your reporting manager. You can track your own leave and travel under Workspace → My requests.",
      sources: [],
      actions: [{ label: "Open Workspace", to: "/workspace" }],
    };
  }
  if (q.includes("ticket") || q.includes("vpn") || q.includes("it ")) {
    return {
      answer: "IT tickets route to ServiceNow. You get an INC number immediately. Shared Services can see open plant and HQ incidents.",
      sources: [],
      actions: [{ label: "Raise IT ticket", to: "/services/it" }],
    };
  }
  return {
    answer:
      "I searched HCCB knowledge, HR policies and plant SOPs. Try travel policy, leave balance, plant safety SOP, or IT tickets.",
    sources: [],
    actions: [{ label: "Search knowledge", to: "/search" }],
  };
}

/* ------------------------------------------------------------------ *
 * Announcements, targeting & popup engine
 * BRD 5.1 (personalised home), 5.11 (notifications),
 * Proposed features Phase 5 (Notifications & Popup Management),
 * Phase 6 (multilingual announcements), Phase 7 (admin control).
 * ------------------------------------------------------------------ */

export type Lane = Persona["lane"];

export type Audience = {
  lanes?: Lane[];
  departments?: string[];
  locations?: string[];
  personas?: string[];
};

export type AnnouncementKind = "Mandatory" | "Policy" | "HR" | "Event" | "Campaign" | "Announcement";
export type AnnouncementPriority = "Critical" | "High" | "Normal";

export type Localised = { title: string; body: string };

export type Announcement = {
  id: string;
  kind: AnnouncementKind;
  priority: AnnouncementPriority;
  title: string;
  body: string;
  detail: string[];
  owner: string;
  publishedAt: string;
  expiresAt: string;
  audience: Audience;
  cta?: { label: string; to: string };
  media?: string;
  /** Phase 5: show as a blocking popup the first time a targeted user lands on Home. */
  popup: boolean;
  /** Phase 5: mandatory update — requires an explicit acknowledgement. */
  acknowledge: boolean;
  i18n?: { "हिन्दी"?: Localised; "ಕನ್ನಡ"?: Localised };
};

export const announcements: Announcement[] = [
  {
    id: "ann-festive-safety",
    kind: "Mandatory",
    priority: "Critical",
    title: "Festive season safety stand-down — acknowledge by 25 Sep",
    body:
      "Volumes peak from next week. PPE discipline, no shortcuts on loading bays, and a five-minute safety huddle before every shift. Every employee must acknowledge this notice.",
    detail: [
      "Applies to all plants, depots and field teams",
      "Line supervisors run the huddle and log attendance",
      "Near misses must still be logged within 2 hours",
    ],
    owner: "EHS Council",
    publishedAt: "2026-09-21",
    expiresAt: "2026-09-26",
    audience: {},
    cta: { label: "Open Plant Safety SOP", to: "/knowledge/sop-plant-safety" },
    popup: true,
    acknowledge: true,
    i18n: {
      "हिन्दी": {
        title: "त्योहारी सीज़न सुरक्षा स्टैंड-डाउन — 25 सितंबर तक स्वीकार करें",
        body:
          "अगले सप्ताह से मात्रा चरम पर होगी। PPE अनुशासन रखें, लोडिंग बे पर कोई शॉर्टकट नहीं, और हर शिफ्ट से पहले पाँच मिनट की सुरक्षा बैठक। हर कर्मचारी को यह सूचना स्वीकार करनी होगी।",
      },
      "ಕನ್ನಡ": {
        title: "ಹಬ್ಬದ ಋತುವಿನ ಸುರಕ್ಷತಾ ಸ್ಟ್ಯಾಂಡ್-ಡೌನ್ — ಸೆ. 25ರೊಳಗೆ ಒಪ್ಪಿಗೆ ನೀಡಿ",
        body:
          "ಮುಂದಿನ ವಾರದಿಂದ ಪ್ರಮಾಣ ಗರಿಷ್ಠವಾಗಲಿದೆ. PPE ಶಿಸ್ತು, ಲೋಡಿಂಗ್ ಬೇಯಲ್ಲಿ ಯಾವುದೇ ಅಡ್ಡದಾರಿ ಇಲ್ಲ, ಮತ್ತು ಪ್ರತಿ ಪಾಳಿಯ ಮೊದಲು ಐದು ನಿಮಿಷಗಳ ಸುರಕ್ಷತಾ ಸಭೆ. ಪ್ರತಿ ಉದ್ಯೋಗಿಯೂ ಈ ಸೂಚನೆಯನ್ನು ಒಪ್ಪಬೇಕು.",
      },
    },
  },
  {
    id: "ann-line2-cip",
    kind: "Mandatory",
    priority: "Critical",
    title: "Chittoor Line 2 CIP window moves to 02:00 from tonight",
    body:
      "Dual lockout stays mandatory. Shift handover notes must be signed by the outgoing operator before the CIP crew enters the bay.",
    detail: [
      "Affects Line 2 night shift only",
      "Eyewash test at 06:00 stays unchanged",
      "Relief operator: S. Prakash",
    ],
    owner: "Chittoor Plant Operations",
    publishedAt: "2026-09-22",
    expiresAt: "2026-09-30",
    audience: { lanes: ["Plant"], locations: ["Chittoor"] },
    cta: { label: "Open CIP SOP", to: "/knowledge/sop-plant-safety" },
    popup: true,
    acknowledge: true,
    i18n: {
      "हिन्दी": {
        title: "चित्तूर लाइन 2 का CIP विंडो आज रात से 02:00 बजे",
        body:
          "ड्यूल लॉकआउट अनिवार्य रहेगा। CIP टीम के प्रवेश से पहले शिफ्ट हैंडओवर नोट्स पर जाने वाले ऑपरेटर के हस्ताक्षर आवश्यक हैं।",
      },
      "ಕನ್ನಡ": {
        title: "ಚಿತ್ತೂರು ಲೈನ್ 2ರ CIP ಅವಧಿ ಇಂದಿನ ರಾತ್ರಿಯಿಂದ 02:00ಕ್ಕೆ",
        body:
          "ಡ್ಯುಯಲ್ ಲಾಕ್‌ಔಟ್ ಕಡ್ಡಾಯವಾಗಿ ಮುಂದುವರಿಯುತ್ತದೆ. CIP ತಂಡ ಪ್ರವೇಶಿಸುವ ಮೊದಲು ಪಾಳಿ ಹಸ್ತಾಂತರ ಟಿಪ್ಪಣಿಗೆ ಹೊರಹೋಗುವ ಆಪರೇಟರ್ ಸಹಿ ಮಾಡಬೇಕು.",
      },
    },
  },
  {
    id: "ann-payroll-cutoff",
    kind: "HR",
    priority: "High",
    title: "Payroll cut-off moves to 24 Sep this cycle",
    body:
      "Claims, overtime and attendance corrections must be in before 6:00 PM on 24 Sep. Anything later moves to the October payslip.",
    detail: ["Travel claims close at 18:00", "Attendance regularisation via Services → Attendance", "Payroll helpdesk: ext. 4180"],
    owner: "Payroll · People Team",
    publishedAt: "2026-09-20",
    expiresAt: "2026-09-25",
    audience: {},
    cta: { label: "Open payslips", to: "/workspace/payslips" },
    popup: false,
    acknowledge: false,
    i18n: {
      "हिन्दी": {
        title: "इस चक्र में पेरोल कट-ऑफ 24 सितंबर हो गया है",
        body:
          "दावे, ओवरटाइम और उपस्थिति सुधार 24 सितंबर शाम 6:00 बजे से पहले जमा करें। इसके बाद के सभी आइटम अक्टूबर की सैलरी स्लिप में जाएंगे।",
      },
      "ಕನ್ನಡ": {
        title: "ಈ ಆವರ್ತನದಲ್ಲಿ ಪೇರೋಲ್ ಕಟ್-ಆಫ್ ಸೆ. 24ಕ್ಕೆ ಬದಲಾಗಿದೆ",
        body:
          "ಕ್ಲೈಮ್‌ಗಳು, ಓವರ್‌ಟೈಮ್ ಮತ್ತು ಹಾಜರಾತಿ ತಿದ್ದುಪಡಿಗಳನ್ನು ಸೆ. 24ರ ಸಂಜೆ 6:00ರೊಳಗೆ ಸಲ್ಲಿಸಿ. ನಂತರದವು ಅಕ್ಟೋಬರ್ ವೇತನ ಚೀಟಿಗೆ ಹೋಗುತ್ತವೆ.",
      },
    },
  },
  {
    id: "ann-credit-policy",
    kind: "Policy",
    priority: "High",
    title: "Credit Policy 2025 v3 published — approval limits revised",
    body:
      "Distributor credit above ₹5,00,000 now needs a second approver from Finance. Items already pending in your queue are unaffected.",
    detail: ["Second approver: Finance Controller", "Applies from 23 Sep 2026", "Bank guarantee rules unchanged"],
    owner: "Finance · Commercial Governance",
    publishedAt: "2026-09-19",
    expiresAt: "2026-10-31",
    audience: { lanes: ["Corporate"] },
    cta: { label: "Review in Admin Console", to: "/admin" },
    popup: false,
    acknowledge: true,
    i18n: {
      "हिन्दी": {
        title: "क्रेडिट नीति 2025 v3 प्रकाशित — अनुमोदन सीमाएँ संशोधित",
        body:
          "₹5,00,000 से अधिक डिस्ट्रीब्यूटर क्रेडिट के लिए अब वित्त से दूसरा अनुमोदक आवश्यक है। आपकी कतार में लंबित आइटम अप्रभावित रहेंगे।",
      },
      "ಕನ್ನಡ": {
        title: "ಕ್ರೆಡಿಟ್ ನೀತಿ 2025 v3 ಪ್ರಕಟ — ಅನುಮೋದನೆ ಮಿತಿಗಳು ಪರಿಷ್ಕೃತ",
        body:
          "₹5,00,000ಕ್ಕಿಂತ ಹೆಚ್ಚಿನ ವಿತರಕ ಕ್ರೆಡಿಟ್‌ಗೆ ಈಗ ಹಣಕಾಸು ವಿಭಾಗದಿಂದ ಎರಡನೇ ಅನುಮೋದಕ ಬೇಕು. ನಿಮ್ಮ ಸರತಿಯಲ್ಲಿ ಬಾಕಿ ಇರುವವುಗಳಿಗೆ ಪರಿಣಾಮವಿಲ್ಲ.",
      },
    },
  },
  {
    id: "ann-townhall",
    kind: "Event",
    priority: "High",
    title: "Leadership Quarterly Townhall · 24 Sep, 3:00 PM IST",
    body:
      "Rajesh Menon opens with the Q3 scorecard, then takes live questions from every plant and office on Teams Live.",
    detail: ["Teams Live · all locations", "Regional language captions available", "Replay posted within 24 hours"],
    owner: "Internal Communications",
    publishedAt: "2026-09-18",
    expiresAt: "2026-09-25",
    audience: {},
    cta: { label: "Ask the CEO", to: "/ceo-talks" },
    popup: false,
    acknowledge: false,
    i18n: {
      "हिन्दी": {
        title: "लीडरशिप त्रैमासिक टाउनहॉल · 24 सितंबर, दोपहर 3:00 बजे IST",
        body:
          "राजेश मेनन Q3 स्कोरकार्ड से शुरुआत करेंगे, फिर Teams Live पर हर प्लांट और ऑफिस से लाइव सवाल लेंगे।",
      },
      "ಕನ್ನಡ": {
        title: "ನಾಯಕತ್ವ ತ್ರೈಮಾಸಿಕ ಟೌನ್‌ಹಾಲ್ · ಸೆ. 24, ಮಧ್ಯಾಹ್ನ 3:00 IST",
        body:
          "ರಾಜೇಶ್ ಮೆನನ್ Q3 ಸ್ಕೋರ್‌ಕಾರ್ಡ್‌ನಿಂದ ಆರಂಭಿಸಿ, ನಂತರ Teams Live ನಲ್ಲಿ ಪ್ರತಿ ಘಟಕ ಮತ್ತು ಕಚೇರಿಯಿಂದ ನೇರ ಪ್ರಶ್ನೆಗಳನ್ನು ಸ್ವೀಕರಿಸುತ್ತಾರೆ.",
      },
    },
  },
  {
    id: "ann-letters-sla",
    kind: "HR",
    priority: "Normal",
    title: "New SLA matrix for employee letters goes live 25 Sep",
    body:
      "Employment and address letters move to a 24-hour SLA; salary letters stay at 48 hours. Templates in the letter desk are already updated.",
    detail: ["Employment letter — 24h", "Address letter — 24h", "Salary letter — 48h"],
    owner: "Shared Services · People",
    publishedAt: "2026-09-21",
    expiresAt: "2026-10-10",
    audience: { lanes: ["Support"] },
    cta: { label: "Open letter desk", to: "/services/letters" },
    popup: false,
    acknowledge: false,
    i18n: {
      "हिन्दी": {
        title: "कर्मचारी पत्रों के लिए नया SLA मैट्रिक्स 25 सितंबर से लागू",
        body:
          "रोज़गार और पते के पत्र अब 24 घंटे के SLA पर; वेतन पत्र 48 घंटे पर रहेंगे। लेटर डेस्क के टेम्पलेट अपडेट हो चुके हैं।",
      },
      "ಕನ್ನಡ": {
        title: "ಉದ್ಯೋಗಿ ಪತ್ರಗಳಿಗೆ ಹೊಸ SLA ಮ್ಯಾಟ್ರಿಕ್ಸ್ ಸೆ. 25ರಿಂದ ಜಾರಿ",
        body:
          "ಉದ್ಯೋಗ ಮತ್ತು ವಿಳಾಸ ಪತ್ರಗಳು 24 ಗಂಟೆಗಳ SLAಗೆ; ವೇತನ ಪತ್ರಗಳು 48 ಗಂಟೆಗಳಲ್ಲಿ ಉಳಿಯುತ್ತವೆ. ಲೆಟರ್ ಡೆಸ್ಕ್ ಟೆಂಪ್ಲೇಟ್‌ಗಳು ಈಗಾಗಲೇ ನವೀಕೃತ.",
      },
    },
  },
  {
    id: "ann-water-campaign",
    kind: "Campaign",
    priority: "Normal",
    title: "Water Positive 2026 — the pledge wall is open",
    body:
      "Every unit is water-positive this year. Add your plant's pledge; the best three go on the CEO's townhall deck.",
    detail: ["Entries close 30 Sep", "One pledge per team", "Photos optional"],
    owner: "Sustainability Office",
    publishedAt: "2026-09-15",
    expiresAt: "2026-09-30",
    audience: {},
    media: "/people/plant.jpg",
    cta: { label: "Read the milestone", to: "/news/n1" },
    popup: false,
    acknowledge: false,
    i18n: {
      "हिन्दी": {
        title: "वॉटर पॉज़िटिव 2026 — प्रतिज्ञा दीवार खुल गई है",
        body:
          "इस वर्ष हर यूनिट वॉटर-पॉज़िटिव है। अपने प्लांट की प्रतिज्ञा जोड़ें; सर्वश्रेष्ठ तीन CEO के टाउनहॉल डेक में जाएँगी।",
      },
      "ಕನ್ನಡ": {
        title: "ವಾಟರ್ ಪಾಸಿಟಿವ್ 2026 — ಪ್ರತಿಜ್ಞಾ ಗೋಡೆ ತೆರೆದಿದೆ",
        body:
          "ಈ ವರ್ಷ ಪ್ರತಿ ಘಟಕವೂ ವಾಟರ್-ಪಾಸಿಟಿವ್. ನಿಮ್ಮ ಘಟಕದ ಪ್ರತಿಜ್ಞೆ ಸೇರಿಸಿ; ಅತ್ಯುತ್ತಮ ಮೂರು CEO ಅವರ ಟೌನ್‌ಹಾಲ್ ಡೆಕ್‌ಗೆ ಸೇರುತ್ತವೆ.",
      },
    },
  },
  {
    id: "ann-onam",
    kind: "Campaign",
    priority: "Normal",
    title: "Onam celebration photos — submissions closed",
    body: "Thanks to the 42 teams who sent entries. Winners were announced on the Kerala depot feed.",
    detail: ["42 entries", "Winners posted 12 Sep"],
    owner: "Internal Communications",
    publishedAt: "2026-09-01",
    expiresAt: "2026-09-12",
    audience: {},
    popup: false,
    acknowledge: false,
  },
];

export type AnnouncementWindow = "Scheduled" | "Live" | "Expired";

/**
 * The prototype runs on a fixed demo clock so scheduling and expiry stay
 * demonstrable whenever the deck is shown. Swap for `new Date()` on a real build.
 */
export const DEMO_NOW = new Date("2026-09-22T09:41:00");

function day(value: string) {
  return new Date(`${value}T00:00:00`);
}

/** Phase 5: scheduled visibility + expiry configuration. */
export function announcementWindow(a: Announcement, now: Date): AnnouncementWindow {
  if (now < day(a.publishedAt)) return "Scheduled";
  if (now > day(a.expiresAt)) return "Expired";
  return "Live";
}

/** Phase 5: user / department / location targeting. */
export function audienceMatch(aud: Audience, p: Persona) {
  if (aud.personas?.length && !aud.personas.includes(p.id)) return false;
  if (aud.lanes?.length && !aud.lanes.includes(p.lane)) return false;
  if (aud.departments?.length && !aud.departments.some((d) => p.department.toLowerCase().includes(d.toLowerCase())))
    return false;
  if (aud.locations?.length && !aud.locations.some((l) => p.location.toLowerCase().includes(l.toLowerCase())))
    return false;
  return true;
}

export function audienceLabel(aud: Audience) {
  const parts = [
    ...(aud.lanes ?? []),
    ...(aud.departments ?? []),
    ...(aud.locations ?? []),
    ...(aud.personas ?? []),
  ];
  return parts.length ? parts.join(" · ") : "All employees";
}

/** Why this user sees an item — drives the "matched to you" chips on Home. */
export function matchReasons(aud: Audience, p: Persona) {
  const out: string[] = [];
  if (aud.lanes?.length) out.push(p.lane);
  if (aud.departments?.length) out.push(p.department);
  if (aud.locations?.length) out.push(p.location);
  if (aud.personas?.length) out.push(p.firstName);
  return out.length ? out : ["All employees"];
}

const priorityRank: Record<AnnouncementPriority, number> = { Critical: 0, High: 1, Normal: 2 };

/** Everything a given employee should see right now, highest priority first. */
export function liveAnnouncementsFor(
  p: Persona,
  now: Date = DEMO_NOW,
  paused: Record<string, boolean> = {}
) {
  return sortAnnouncements(
    announcements.filter(
      (a) => !paused[a.id] && announcementWindow(a, now) === "Live" && audienceMatch(a.audience, p)
    )
  );
}

export function sortAnnouncements(list: Announcement[]) {
  return [...list].sort(
    (a, b) =>
      priorityRank[a.priority] - priorityRank[b.priority] ||
      day(b.publishedAt).getTime() - day(a.publishedAt).getTime()
  );
}

export function localisedAnnouncement(a: Announcement, language: string): Localised {
  const t = a.i18n?.[language as "हिन्दी" | "ಕನ್ನಡ"];
  return t ?? { title: a.title, body: a.body };
}

export function formatDay(value: string) {
  return day(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}

/* ------------------------------------------------------------------ *
 * CEO Talks — Ask Me Anything
 * BRD 5.1 (leadership messages) + Leadership Corner,
 * Proposed features: leadership announcements & community engagement.
 * ------------------------------------------------------------------ */

export const ceo = {
  name: "Rajesh Menon",
  title: "Chief Executive Officer · HCCB",
  avatar: "/people/rajesh.jpg",
};

export type AmaSession = {
  id: string;
  title: string;
  when: string;
  date: string;
  status: "Live" | "Upcoming" | "Replay";
  channel: string;
  summary: string;
  topics: string[];
  registered: number;
  questionsOpen: boolean;
};

export const amaSessions: AmaSession[] = [
  {
    id: "ama-sep",
    title: "September edition",
    when: "Thu 24 Sep · 3:00 PM IST",
    date: "2026-09-24",
    status: "Upcoming",
    channel: "Teams Live · all plants and offices",
    summary:
      "Q3 scorecard first, then 40 minutes of unfiltered questions. The most upvoted questions are answered live; the rest get a written reply within a week.",
    topics: ["Growth", "Safety", "Careers", "Culture", "Technology"],
    registered: 1842,
    questionsOpen: true,
  },
  {
    id: "ama-jun",
    title: "June edition · Water positivity & capex",
    when: "Wed 25 Jun · 3:00 PM IST",
    date: "2026-06-25",
    status: "Replay",
    channel: "Teams Live · replay available",
    summary:
      "Capex for the Chittoor and Guwahati lines, the water positivity roadmap, and why the shift-allowance review moved to Q3.",
    topics: ["Capex", "Sustainability", "Rewards"],
    registered: 2104,
    questionsOpen: false,
  },
];

export type AmaQuestion = {
  id: string;
  sessionId: string;
  author: string;
  role: string;
  lane: Lane;
  topic: string;
  text: string;
  upvotes: number;
  status: "Answered" | "Shortlisted" | "Pending";
  answer?: string;
  answeredAt?: string;
  mine?: boolean;
};

export const amaQuestions: AmaQuestion[] = [
  {
    id: "q1",
    sessionId: "ama-sep",
    author: "Ramesh Kumar",
    role: "Shift Line Operator",
    lane: "Plant",
    topic: "Careers",
    text: "Plant operators rarely make it into corporate roles. What is the actual path from the shop floor to a manager role?",
    upvotes: 214,
    status: "Shortlisted",
  },
  {
    id: "q2",
    sessionId: "ama-sep",
    author: "Anonymous",
    role: "Field Sales",
    lane: "Corporate",
    topic: "Rewards",
    text: "Field allowances have not moved in two years while fuel has. Is a revision on the table for this cycle?",
    upvotes: 188,
    status: "Shortlisted",
  },
  {
    id: "q3",
    sessionId: "ama-sep",
    author: "Priya Sharma",
    role: "Shared Services Lead",
    lane: "Support",
    topic: "Technology",
    text: "Employees still email HR for letters that the portal can issue. What is the plan to retire the parallel channels?",
    upvotes: 156,
    status: "Answered",
    answer:
      "Fair challenge. From October the letter desk in this Hub becomes the only intake — HR mailboxes will auto-reply with the link. Shared Services keeps the exception queue for anything the templates cannot cover.",
    answeredAt: "Answered in writing · 20 Sep",
  },
  {
    id: "q4",
    sessionId: "ama-sep",
    author: "Meera Iyer",
    role: "Area Sales Manager",
    lane: "Corporate",
    topic: "Growth",
    text: "Where do we expect volume to come from in Q4 — new outlets or deeper penetration in the ones we have?",
    upvotes: 132,
    status: "Pending",
  },
  {
    id: "q5",
    sessionId: "ama-sep",
    author: "Anonymous",
    role: "Manufacturing",
    lane: "Plant",
    topic: "Safety",
    text: "Night shift crews are running short-handed during CIP. Can we commit to a minimum crew size instead of case-by-case calls?",
    upvotes: 121,
    status: "Shortlisted",
  },
  {
    id: "q6",
    sessionId: "ama-sep",
    author: "Sunita Verma",
    role: "Regional Auditor",
    lane: "Corporate",
    topic: "Culture",
    text: "How is leadership measuring whether the new ways of working actually reduced approval cycle time?",
    upvotes: 97,
    status: "Pending",
  },
  {
    id: "q7",
    sessionId: "ama-jun",
    author: "Sanjay Menon",
    role: "ASM",
    lane: "Corporate",
    topic: "Capex",
    text: "Will the Chittoor line expansion change the South distribution footprint?",
    upvotes: 204,
    status: "Answered",
    answer:
      "Yes, but gradually. The new line adds capacity from Q1 next year, and we will re-cut the South depot map only after two clean quarters of run rate. No depot closures are planned.",
    answeredAt: "Answered live · 25 Jun",
  },
  {
    id: "q8",
    sessionId: "ama-jun",
    author: "Anonymous",
    role: "Manufacturing",
    lane: "Plant",
    topic: "Rewards",
    text: "Why did the shift allowance review slip from Q2 to Q3?",
    upvotes: 178,
    status: "Answered",
    answer:
      "Because I would rather do it once, properly. The review now covers shift, travel and plant allowances together, and the outcome lands with the October cycle — not another deferral.",
    answeredAt: "Answered live · 25 Jun",
  },
  {
    id: "q9",
    sessionId: "ama-jun",
    author: "Rohit Nair",
    role: "Territory Manager",
    lane: "Corporate",
    topic: "Sustainability",
    text: "Does water positivity change anything for the depots, or is it only a plant metric?",
    upvotes: 88,
    status: "Answered",
    answer:
      "It is a company metric. Depots contribute through recharge projects in their catchment; those are now part of the regional scorecard, not a side project.",
    answeredAt: "Answered in writing · 02 Jul",
  },
];

export const amaTopics = ["Growth", "Safety", "Careers", "Culture", "Technology", "Rewards"];

/* ------------------------------------------------------------------ *
 * Personalised announcement feed — BRD 5.1 "personalised view based on
 * location, department"; Proposed features "Personalized Employee
 * Experience" + "Dynamic Announcements Banner".
 * ------------------------------------------------------------------ */

export type PersonalCard = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  reasons: string[];
  cta: { label: string; to: string };
  tone: "brand" | "dark" | "plain";
  stat?: { label: string; value: string };
};

export function personalFeed(
  p: Persona,
  ctx: { pending: number; openTickets: number; leaveDays: number; training: number }
): PersonalCard[] {
  const who = [p.location, p.department];
  if (p.lane === "Plant") {
    return [
      {
        id: "pf-shift",
        eyebrow: `For you · ${p.firstName}`,
        title: "Your Line 2 shift starts with a signed CIP handover",
        body: `The CIP window moved to 02:00 tonight. Sign the handover before the crew enters — this is targeted to ${p.location}.`,
        reasons: [...who, "Night shift"],
        cta: { label: "Open the SOP", to: "/knowledge/sop-plant-safety" },
        tone: "dark",
        stat: { label: "Last punch", value: "09:04" },
      },
      {
        id: "pf-training",
        eyebrow: "For you · Learning",
        title: `Plant safety module is ${ctx.training}% complete`,
        body: "Defensive driving and chemical handling both close on 30 Sep. Fifteen minutes clears the backlog.",
        reasons: [p.department, "Required"],
        cta: { label: "Continue learning", to: "/learning" },
        tone: "plain",
        stat: { label: "Complete", value: `${ctx.training}%` },
      },
      {
        id: "pf-leave",
        eyebrow: "For you · Leave",
        title: `${ctx.leaveDays} leave days left before the December reset`,
        body: "Plant leave needs relief cover, so apply at least three working days ahead.",
        reasons: [p.location, "Shift roster"],
        cta: { label: "Request leave", to: "/services/leave" },
        tone: "plain",
        stat: { label: "Balance", value: `${ctx.leaveDays}d` },
      },
    ];
  }
  if (p.lane === "Support") {
    return [
      {
        id: "pf-sla",
        eyebrow: `For you · ${p.firstName}`,
        title: "Letter SLA drops to 24 hours on 25 Sep",
        body: `Employment and address letters move to a one-day turnaround. Targeted to ${p.department} because you run the desk.`,
        reasons: [...who, "Letter desk owner"],
        cta: { label: "Open letter desk", to: "/services/letters" },
        tone: "brand",
        stat: { label: "Open tickets", value: String(ctx.openTickets) },
      },
      {
        id: "pf-queue",
        eyebrow: "For you · Service desk",
        title: `${ctx.openTickets} employee tickets are still open on your name`,
        body: "Plant VPN and SAP access are the two ageing ones. Both breach SLA tomorrow morning.",
        reasons: [p.department, "Assigned to you"],
        cta: { label: "Open the queue", to: "/workspace" },
        tone: "plain",
        stat: { label: "Ageing", value: "2" },
      },
      {
        id: "pf-payroll",
        eyebrow: "For you · Payroll",
        title: "Payroll cut-off is 24 Sep, 6:00 PM",
        body: "Anything your desk collects after the cut-off lands in the October payslip — warn requesters early.",
        reasons: ["All employees", p.location],
        cta: { label: "Open payslips", to: "/workspace/payslips" },
        tone: "plain",
      },
    ];
  }
  return [
    {
      id: "pf-queue",
      eyebrow: `For you · ${p.firstName}`,
      title: `${ctx.pending} approvals are waiting on you`,
      body: `Distributor credit, travel and plant leave from the South Zone. Routed here because you own the ${p.department} queue.`,
      reasons: [...who, "Approver"],
      cta: { label: "Review in Workspace", to: "/workspace" },
      tone: "brand",
      stat: { label: "Pending", value: String(ctx.pending) },
    },
    {
      id: "pf-credit",
      eyebrow: "For you · Policy",
      title: "Credit Policy v3 changes your approval limit",
      body: "Anything above ₹5,00,000 now needs a Finance co-approver. Acknowledge it before your next credit decision.",
      reasons: [p.lane, "Credit approver"],
      cta: { label: "Read the notice", to: "/announcements/ann-credit-policy" },
      tone: "plain",
    },
    {
      id: "pf-townhall",
      eyebrow: "For you · Leadership",
      title: "Your zone has three shortlisted questions for the CEO",
      body: "The September AMA is on 24 Sep. Add yours or upvote what your teams already asked.",
      reasons: [p.location, "Townhall invitee"],
      cta: { label: "Open CEO Talks", to: "/ceo-talks" },
      tone: "plain",
      stat: { label: "Registered", value: "1,842" },
    },
  ];
}
