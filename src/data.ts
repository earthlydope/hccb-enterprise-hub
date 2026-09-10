export const user = {
  id: "E123456",
  firstName: "Avinash",
  lastName: "B M",
  fullName: "Avinash B M",
  role: "Business Manager",
  department: "Field Sales Operations",
  location: "Bengaluru Plant",
  manager: "Priya Sharma",
  email: "avinash.bm@hccb.in",
  phone: "+91 98765 43210",
  status: "Active" as const,
  avatar: "/avatar.jpg",
  isAdmin: true,
};

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
];

export type Ticket = {
  id: string;
  title: string;
  category: string;
  priority: "Low" | "Medium" | "High";
  status: "Open" | "In progress" | "Resolved";
  updated: string;
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
    title: "CEO note: Safety first this festive season",
    category: "Leadership",
    read: "3 min",
    time: "2h ago",
    body: "As volumes ramp up, keep PPE discipline and no shortcuts on loading bays. Thank you for protecting each other.",
  },
  {
    id: "n2",
    title: "Bengaluru Plant hits 30 days zero-loss-time",
    category: "Plant",
    read: "2 min",
    time: "Yesterday",
    body: "Operations and EHS teams closed a 30-day streak. Recognition event at 4 PM in the canteen.",
  },
  {
    id: "n3",
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
  { id: "r1", from: "Priya Sharma", to: "Avinash B M", text: "Outstanding Q2 beat conversion in East Bengaluru.", when: "Today" },
  { id: "r2", from: "EHS Team", to: "Bengaluru Plant", text: "30 days LTI-free. Proud of the floor teams.", when: "Yesterday" },
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

export function copilotAnswer(query: string) {
  const q = query.toLowerCase();
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
      answer:
        "You have 12 casual leave days. Apply 3 working days in advance. Managers must action within 48 hours. Internal transfers go through HR Services with manager endorsement.",
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
        "Q3 sparkling playbook is live: hero SKUs 600ml / 1.25L / 250ml RGB. Perfect store target 92% urban. Your South MTD volume is 104% of plan.",
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
        "Field Sales onboarding pack covers DMS/CRM access, ride-along, and Day-30 Perfect Store certification.",
      sources: ["onboard-fso"],
      actions: [{ label: "Open onboarding pack", to: "/knowledge/onboard-fso" }],
    };
  }
  if (q.includes("safety") || q.includes("sop") || q.includes("ppe")) {
    return {
      answer:
        "Bengaluru Plant Safety SOP v4.2: PPE in all production zones, LOTO before intervention, near-miss within 2 hours, assembly at Gate 2.",
      sources: ["sop-plant-safety"],
      actions: [{ label: "Open SOP", to: "/knowledge/sop-plant-safety" }],
    };
  }
  if (q.includes("approval") || q.includes("credit")) {
    return {
      answer: "You have pending approvals in Workspace. Three distributor credit requests and two travel claims need review.",
      sources: [],
      actions: [{ label: "Review in Workspace", to: "/workspace" }],
    };
  }
  return {
    answer:
      "I searched HCCB knowledge, HR policies and sales playbooks. Try asking about travel policy, leave, plant safety SOP, or Q3 sales targets.",
    sources: [],
    actions: [{ label: "Search knowledge", to: "/search" }],
  };
}
