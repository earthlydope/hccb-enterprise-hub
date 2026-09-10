export type Role = "manager" | "plant" | "support" | "admin";

export type Persona = {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  empId: string;
  email: string;
  roleTitle: string;
  department: string;
  location: string;
  manager: string;
  avatar: string;
  status: "Active";
  roles: Role[];
  leaveDays: number;
  training: number;
  openReq: number;
  blurb: string;
  homeFocus: string;
  nets: string;
  lane: "Corporate" | "Plant" | "Support";
};

export const personas: Persona[] = [
  {
    id: "avinash",
    firstName: "Avinash",
    lastName: "B M",
    fullName: "Avinash B M",
    empId: "HCCB-48190",
    email: "avinash.bm@hccb.co.in",
    roleTitle: "Senior Operations Manager · South Zone",
    department: "Corporate Operations",
    location: "Bengaluru HQ",
    manager: "Sanjay Varma (VP Ops)",
    avatar: "/avinash.jpg",
    status: "Active",
    roles: ["manager", "admin"],
    leaveDays: 12,
    training: 72,
    openReq: 2,
    blurb: "Corporate queue, credit & travel approvals, Admin Console",
    homeFocus: "Team approvals and plant + sales operations",
    nets: "₹1,42,850",
    lane: "Corporate",
  },
  {
    id: "ramesh",
    firstName: "Ramesh",
    lastName: "Kumar",
    fullName: "Ramesh Kumar",
    empId: "HCCB-33821",
    email: "ramesh.kumar@hccb.co.in",
    roleTitle: "Shift Line Operator",
    department: "Manufacturing",
    location: "Chittoor Plant · Line 2",
    manager: "Avinash B M",
    avatar: "/people/ramesh.jpg",
    status: "Active",
    roles: ["plant"],
    leaveDays: 6,
    training: 64,
    openReq: 1,
    blurb: "Shift SOP, punch, leave, plant safety",
    homeFocus: "Shift SOP and EHS",
    nets: "₹48,210",
    lane: "Plant",
  },
  {
    id: "priya",
    firstName: "Priya",
    lastName: "Sharma",
    fullName: "Priya Sharma",
    empId: "HCCB-22014",
    email: "priya.sharma@hccb.co.in",
    roleTitle: "Shared Services Lead · Employee Support",
    department: "People & IT Support",
    location: "Bengaluru HQ · Service desk",
    manager: "Sanjay Varma (VP Ops)",
    avatar: "/people/priya.jpg",
    status: "Active",
    roles: ["support"],
    leaveDays: 9,
    training: 88,
    openReq: 3,
    blurb: "Tickets, letters, claims, communities — employee support",
    homeFocus: "Service desk, letters, and employee requests",
    nets: "₹1,28,400",
    lane: "Support",
  },
];

export const defaultPersona = personas[0];

export function getPersona(id: string) {
  return personas.find((p) => p.id === id) ?? defaultPersona;
}

export function hasRole(p: Persona, role: Role) {
  return p.roles.includes(role);
}

export function isManager(p: Persona) {
  return hasRole(p, "manager") || hasRole(p, "admin");
}

export function isPlant(p: Persona) {
  return hasRole(p, "plant");
}

export function isSupport(p: Persona) {
  return hasRole(p, "support");
}

export function isAdmin(p: Persona) {
  return hasRole(p, "admin");
}
