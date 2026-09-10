import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import {
  initialApprovals,
  initialLeaves,
  initialTickets,
  type Approval,
  type ApprovalStatus,
  type LeaveRequest,
  type Ticket,
  user,
} from "./data";

export type Toast = { id: string; text: string; tone?: "ok" | "info" };
export type Notif = {
  id: string;
  title: string;
  body: string;
  category: string;
  read: boolean;
  to: string;
};

type CopilotMsg = { role: "user" | "assistant"; text: string; sources?: string[]; actions?: { label: string; to: string }[] };

type State = {
  session: boolean;
  approvals: Approval[];
  tickets: Ticket[];
  leaves: LeaveRequest[];
  travels: { id: string; dest: string; dates: string; status: string; cost: string }[];
  jobApps: string[];
  bookmarks: string[];
  favApps: string[];
  notifications: Notif[];
  toasts: Toast[];
  searchHistory: string[];
  copilot: CopilotMsg[];
  newsRead: string[];
  letters: string[];
  governance: Record<string, "Published" | "Archived" | "In review">;
  courses: Record<string, number>;
};

const seedNotifs: Notif[] = [
  { id: "n1", title: "5 approvals waiting", body: "3 credit + 2 travel", category: "Approvals", read: false, to: "/workspace" },
  { id: "n2", title: "Defensive driving due 22 Sep", body: "72% complete", category: "Learning", read: false, to: "/learning" },
  { id: "n3", title: "CEO note posted", body: "Safety first this festive season", category: "Company", read: false, to: "/news/n1" },
  { id: "n4", title: "Priya recognized you", body: "Outstanding Q2 beat conversion", category: "Recognition", read: true, to: "/recognition" },
  { id: "n5", title: "INC-20918 in progress", body: "Network team assigned", category: "Service Requests", read: true, to: "/services/it" },
];

const initial: State = {
  session: false,
  approvals: initialApprovals,
  tickets: initialTickets,
  leaves: initialLeaves,
  travels: [],
  jobApps: [],
  bookmarks: [],
  favApps: ["sap", "crm", "dms"],
  notifications: seedNotifs,
  toasts: [],
  searchHistory: ["Leave policy", "Travel reimbursement"],
  copilot: [],
  newsRead: [],
  letters: [],
  governance: {},
  courses: { c1: 100, c2: 72, c3: 40, c4: 0 },
};

type Action =
  | { type: "HYDRATE"; state: State }
  | { type: "LOGIN" }
  | { type: "LOGOUT" }
  | { type: "TOAST"; text: string; tone?: "ok" | "info" }
  | { type: "DISMISS_TOAST"; id: string }
  | { type: "SET_APPROVAL"; id: string; status: ApprovalStatus }
  | { type: "ADD_TICKET"; ticket: Ticket }
  | { type: "ADD_LEAVE"; leave: LeaveRequest }
  | { type: "ADD_TRAVEL"; item: State["travels"][number] }
  | { type: "APPLY_JOB"; id: string }
  | { type: "TOGGLE_BOOKMARK"; id: string }
  | { type: "TOGGLE_FAV"; id: string }
  | { type: "READ_NOTIF"; id: string }
  | { type: "READ_ALL" }
  | { type: "DISMISS_NOTIF"; id: string }
  | { type: "SEARCH"; q: string }
  | { type: "COPILOT"; msg: CopilotMsg }
  | { type: "CLEAR_COPILOT" }
  | { type: "READ_NEWS"; id: string }
  | { type: "LETTER"; name: string }
  | { type: "GOV"; id: string; status: "Published" | "Archived" | "In review" }
  | { type: "COURSE"; id: string; progress: number };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "HYDRATE":
      return { ...action.state, toasts: [] };
    case "LOGIN":
      return { ...state, session: true };
    case "LOGOUT":
      return { ...state, session: false };
    case "TOAST":
      return {
        ...state,
        toasts: [...state.toasts, { id: crypto.randomUUID(), text: action.text, tone: action.tone ?? "ok" }],
      };
    case "DISMISS_TOAST":
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.id) };
    case "SET_APPROVAL":
      return {
        ...state,
        approvals: state.approvals.map((a) => (a.id === action.id ? { ...a, status: action.status } : a)),
      };
    case "ADD_TICKET":
      return { ...state, tickets: [action.ticket, ...state.tickets] };
    case "ADD_LEAVE":
      return { ...state, leaves: [action.leave, ...state.leaves] };
    case "ADD_TRAVEL":
      return { ...state, travels: [action.item, ...state.travels] };
    case "APPLY_JOB":
      return { ...state, jobApps: state.jobApps.includes(action.id) ? state.jobApps : [...state.jobApps, action.id] };
    case "TOGGLE_BOOKMARK":
      return {
        ...state,
        bookmarks: state.bookmarks.includes(action.id)
          ? state.bookmarks.filter((x) => x !== action.id)
          : [...state.bookmarks, action.id],
      };
    case "TOGGLE_FAV":
      return {
        ...state,
        favApps: state.favApps.includes(action.id)
          ? state.favApps.filter((x) => x !== action.id)
          : [...state.favApps, action.id],
      };
    case "READ_NOTIF":
      return {
        ...state,
        notifications: state.notifications.map((n) => (n.id === action.id ? { ...n, read: true } : n)),
      };
    case "READ_ALL":
      return { ...state, notifications: state.notifications.map((n) => ({ ...n, read: true })) };
    case "DISMISS_NOTIF":
      return { ...state, notifications: state.notifications.filter((n) => n.id !== action.id) };
    case "SEARCH": {
      const q = action.q.trim();
      if (!q) return state;
      return { ...state, searchHistory: [q, ...state.searchHistory.filter((s) => s !== q)].slice(0, 8) };
    }
    case "COPILOT":
      return { ...state, copilot: [...state.copilot, action.msg] };
    case "CLEAR_COPILOT":
      return { ...state, copilot: [] };
    case "READ_NEWS":
      return {
        ...state,
        newsRead: state.newsRead.includes(action.id) ? state.newsRead : [...state.newsRead, action.id],
      };
    case "LETTER":
      return {
        ...state,
        letters: state.letters.includes(action.name) ? state.letters : [...state.letters, action.name],
      };
    case "GOV":
      return { ...state, governance: { ...state.governance, [action.id]: action.status } };
    case "COURSE":
      return { ...state, courses: { ...state.courses, [action.id]: action.progress } };
    default:
      return state;
  }
}

const KEY = "hccb-hub-v1";

const Ctx = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
  pendingCount: number;
  unread: number;
} | null>(null);

export function HubProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) dispatch({ type: "HYDRATE", state: JSON.parse(raw) });
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify({ ...state, toasts: [] }));
  }, [state]);

  useEffect(() => {
    if (!state.toasts.length) return;
    const t = setTimeout(() => dispatch({ type: "DISMISS_TOAST", id: state.toasts[0].id }), 2600);
    return () => clearTimeout(t);
  }, [state.toasts]);

  const pendingCount = state.approvals.filter((a) => a.status === "Pending").length;
  const unread = state.notifications.filter((n) => !n.read).length;
  const value = useMemo(() => ({ state, dispatch, pendingCount, unread }), [state, pendingCount, unread]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useHub() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("Hub");
  return ctx;
}

export function toast(dispatch: React.Dispatch<Action>, text: string, tone?: "ok" | "info") {
  dispatch({ type: "TOAST", text, tone });
}

export { user };
