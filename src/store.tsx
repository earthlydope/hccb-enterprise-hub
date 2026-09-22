import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from "react";
import {
  amaQuestions as seedAmaQuestions,
  initialApprovals,
  type AmaQuestion,
  type Approval,
  type ApprovalStatus,
  type LeaveRequest,
  type Ticket,
} from "./data";
import { liveAnnouncementsFor, type Announcement } from "./data";
import { defaultPersona, getPersona, isManager, personas, type Persona } from "./personas";

export type Toast = { id: string; text: string; tone?: "ok" | "info" };
export type Notif = {
  id: string;
  title: string;
  body: string;
  category: string;
  read: boolean;
  to: string;
};

export type CopilotMsg = {
  role: "user" | "assistant";
  text: string;
  sources?: string[];
  actions?: { label: string; to: string }[];
};

export type UserSlice = {
  tickets: Ticket[];
  leaves: LeaveRequest[];
  travels: { id: string; dest: string; dates: string; status: string; cost: string }[];
  jobApps: string[];
  bookmarks: string[];
  favApps: string[];
  notifications: Notif[];
  searchHistory: string[];
  copilot: CopilotMsg[];
  newsRead: string[];
  letters: string[];
  courses: Record<string, number>;
  /** Announcements this user has acknowledged (mandatory / policy notices). */
  annAck: string[];
  /** Announcements this user dismissed from the Home rail. */
  annDismissed: string[];
  /** Popups already served to this user — a popup shows once per announcement. */
  annSeen: string[];
  /** CEO Talks: questions this user submitted. */
  amaAsked: AmaQuestion[];
  /** CEO Talks: question ids this user upvoted. */
  amaUpvotes: string[];
  /** CEO Talks: sessions this user registered for. */
  amaRegistered: string[];
};

type State = {
  session: boolean;
  userId: string;
  language: "English" | "हिन्दी" | "ಕನ್ನಡ";
  approvals: Approval[];
  governance: Record<string, "Published" | "Archived" | "In review">;
  /** Admin Console: announcements paused by a content manager. */
  annPaused: Record<string, boolean>;
  users: Record<string, UserSlice>;
  toasts: Toast[];
};

function coursesFrom(training: number): Record<string, number> {
  return {
    c1: 100,
    c2: Math.min(100, training),
    c3: Math.max(0, Math.min(100, training - 24)),
    c4: training >= 95 ? 40 : 0,
  };
}

function sliceFor(p: Persona): UserSlice {
  const base: UserSlice = {
    tickets: [],
    leaves: [
      {
        id: `LV-${p.id.slice(0, 2).toUpperCase()}12`,
        type: "Casual Leave",
        from: "18 Sep 2026",
        to: "19 Sep 2026",
        days: 2,
        note: "Family function",
        status: "Approved",
      },
    ],
    travels: [],
    jobApps: [],
    bookmarks: [],
    favApps: ["sap", "crm", "dms"],
    notifications: [],
    searchHistory: ["Leave policy"],
    copilot: [],
    newsRead: [],
    letters: [],
    courses: coursesFrom(p.training),
    annAck: [],
    annDismissed: [],
    annSeen: [],
    amaAsked: [],
    amaUpvotes: [],
    amaRegistered: [],
  };

  if (p.id === "avinash") {
    return {
      ...base,
      favApps: ["sap", "pbi", "crm"],
      searchHistory: ["Leave policy", "Credit policy"],
      tickets: [
        {
          id: "INC-20844",
          title: "SAP T-code authorization",
          category: "Access",
          priority: "Medium",
          status: "Open",
          updated: "Yesterday",
        },
      ],
      notifications: [
        { id: "n0", title: "Festive safety stand-down", body: "Mandatory · acknowledge by 25 Sep", category: "Announcements", read: false, to: "/announcements/ann-festive-safety" },
        { id: "n1", title: "Approvals waiting", body: "Credit, travel and plant leave in your queue", category: "Approvals", read: false, to: "/workspace" },
        { id: "n2", title: "Credit Policy v3 published", body: "Approval limits revised above ₹5L", category: "Announcements", read: false, to: "/announcements/ann-credit-policy" },
        { id: "n3", title: "CEO Talks · questions open", body: "September AMA on 24 Sep, 3:00 PM IST", category: "Leadership", read: false, to: "/ceo-talks" },
        { id: "n4", title: "Defensive driving due 22 Sep", body: `${p.training}% complete`, category: "Learning", read: false, to: "/learning" },
      ],
    };
  }

  if (p.id === "ramesh") {
    return {
      ...base,
      favApps: ["sap"],
      searchHistory: ["Plant safety SOP", "Leave policy"],
      tickets: [
        {
          id: "INC-20918",
          title: "VPN timeout on plant Wi-Fi",
          category: "Network",
          priority: "High",
          status: "In progress",
          updated: "1h ago",
          note: "Line 2 locker room AP drops during CIP.",
        },
      ],
      notifications: [
        { id: "n0", title: "Line 2 CIP window moved to 02:00", body: "Mandatory · acknowledge before shift", category: "Announcements", read: false, to: "/announcements/ann-line2-cip" },
        { id: "n1", title: "Sign CIP SOP before shift", body: "Mandatory EHS · Line 2", category: "Company", read: false, to: "/knowledge" },
        { id: "n2", title: "Your AMA question is shortlisted", body: "214 upvotes · answered live on 24 Sep", category: "Leadership", read: false, to: "/ceo-talks" },
        { id: "n3", title: "Leave balance reminder", body: `${p.leaveDays} days remaining`, category: "Service Requests", read: false, to: "/services/leave" },
        { id: "n4", title: "Training: plant safety", body: `${p.training}% complete`, category: "Learning", read: false, to: "/learning" },
      ],
    };
  }

  return {
    ...base,
    favApps: ["snow", "hr", "lms"],
    searchHistory: ["Travel reimbursement", "Employee letters"],
    tickets: [
      {
        id: "INC-20918",
        title: "VPN timeout on plant Wi-Fi",
        category: "Network · assigned",
        priority: "High",
        status: "In progress",
        updated: "1h ago",
        note: "Ramesh Kumar · Chittoor Line 2",
      },
      {
        id: "INC-20890",
        title: "Payslip reprint — new joiner",
        category: "HR",
        priority: "Low",
        status: "Open",
        updated: "Today",
      },
      {
        id: "INC-20844",
        title: "SAP T-code authorization",
        category: "Access · assigned",
        priority: "Medium",
        status: "Open",
        updated: "Yesterday",
      },
    ],
    notifications: [
      { id: "n0", title: "Letter SLA drops to 24 hours on 25 Sep", body: "Announcement for Shared Services", category: "Announcements", read: false, to: "/announcements/ann-letters-sla" },
      { id: "n1", title: "3 tickets in the support queue", body: "Plant VPN, SAP access, payslip reprint", category: "Service Requests", read: false, to: "/workspace" },
      { id: "n2", title: "The CEO answered your question", body: "Letter intake moves to the Hub in October", category: "Leadership", read: false, to: "/ceo-talks" },
      { id: "n3", title: "Payroll cut-off 24 Sep, 6:00 PM", body: "Warn requesters before the window closes", category: "Announcements", read: false, to: "/announcements/ann-payroll-cutoff" },
      { id: "n4", title: "Community huddle notes", body: "Bengaluru Plant posted safety notes", category: "Company", read: false, to: "/communities" },
    ],
  };
}

function emptyUsers(): Record<string, UserSlice> {
  return Object.fromEntries(personas.map((p) => [p.id, sliceFor(p)]));
}

const initial: State = {
  session: false,
  userId: defaultPersona.id,
  language: "English",
  approvals: initialApprovals,
  governance: {},
  annPaused: {},
  users: emptyUsers(),
  toasts: [],
};

type Action =
  | { type: "HYDRATE"; state: State }
  | { type: "LOGIN"; userId: string }
  | { type: "LOGOUT" }
  | { type: "LANG"; language: State["language"] }
  | { type: "TOAST"; text: string; tone?: "ok" | "info" }
  | { type: "DISMISS_TOAST"; id: string }
  | { type: "SET_APPROVAL"; id: string; status: ApprovalStatus }
  | { type: "ADD_TICKET"; ticket: Ticket }
  | { type: "ADD_LEAVE"; leave: LeaveRequest; approval?: Approval }
  | { type: "ADD_TRAVEL"; item: UserSlice["travels"][number]; approval?: Approval }
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
  | { type: "COURSE"; id: string; progress: number }
  | { type: "ACK_ANN"; id: string }
  | { type: "DISMISS_ANN"; id: string }
  | { type: "SEEN_ANN"; id: string }
  | { type: "PAUSE_ANN"; id: string; paused: boolean }
  | { type: "ASK_AMA"; question: AmaQuestion }
  | { type: "UPVOTE_AMA"; id: string }
  | { type: "REGISTER_AMA"; id: string };

function patchUser(state: State, fn: (s: UserSlice) => UserSlice): State {
  const cur = state.users[state.userId] ?? sliceFor(getPersona(state.userId));
  return { ...state, users: { ...state.users, [state.userId]: fn(cur) } };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "HYDRATE": {
      if (!action.state?.users || !action.state.users[defaultPersona.id]) return initial;
      const merged = Object.fromEntries(
        personas.map((p) => [p.id, { ...sliceFor(p), ...(action.state.users?.[p.id] ?? {}) }])
      );
      return {
        ...initial,
        ...action.state,
        annPaused: action.state.annPaused ?? {},
        users: merged,
        toasts: [],
        userId: action.state.userId && getPersona(action.state.userId).id === action.state.userId ? action.state.userId : defaultPersona.id,
      };
    }
    case "LOGIN":
      return { ...state, session: true, userId: action.userId };
    case "LOGOUT":
      return { ...state, session: false };
    case "LANG":
      return { ...state, language: action.language };
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
      return patchUser(state, (s) => ({ ...s, tickets: [action.ticket, ...s.tickets] }));
    case "ADD_LEAVE":
      return {
        ...patchUser(state, (s) => ({ ...s, leaves: [action.leave, ...s.leaves] })),
        approvals: action.approval ? [action.approval, ...state.approvals] : state.approvals,
      };
    case "ADD_TRAVEL":
      return {
        ...patchUser(state, (s) => ({ ...s, travels: [action.item, ...s.travels] })),
        approvals: action.approval ? [action.approval, ...state.approvals] : state.approvals,
      };
    case "APPLY_JOB":
      return patchUser(state, (s) => ({
        ...s,
        jobApps: s.jobApps.includes(action.id) ? s.jobApps : [...s.jobApps, action.id],
      }));
    case "TOGGLE_BOOKMARK":
      return patchUser(state, (s) => ({
        ...s,
        bookmarks: s.bookmarks.includes(action.id) ? s.bookmarks.filter((x) => x !== action.id) : [...s.bookmarks, action.id],
      }));
    case "TOGGLE_FAV":
      return patchUser(state, (s) => ({
        ...s,
        favApps: s.favApps.includes(action.id) ? s.favApps.filter((x) => x !== action.id) : [...s.favApps, action.id],
      }));
    case "READ_NOTIF":
      return patchUser(state, (s) => ({
        ...s,
        notifications: s.notifications.map((n) => (n.id === action.id ? { ...n, read: true } : n)),
      }));
    case "READ_ALL":
      return patchUser(state, (s) => ({
        ...s,
        notifications: s.notifications.map((n) => ({ ...n, read: true })),
      }));
    case "DISMISS_NOTIF":
      return patchUser(state, (s) => ({
        ...s,
        notifications: s.notifications.filter((n) => n.id !== action.id),
      }));
    case "SEARCH": {
      const q = action.q.trim();
      if (!q) return state;
      return patchUser(state, (s) => ({
        ...s,
        searchHistory: [q, ...s.searchHistory.filter((x) => x !== q)].slice(0, 8),
      }));
    }
    case "COPILOT":
      return patchUser(state, (s) => ({ ...s, copilot: [...s.copilot, action.msg] }));
    case "CLEAR_COPILOT":
      return patchUser(state, (s) => ({ ...s, copilot: [] }));
    case "READ_NEWS":
      return patchUser(state, (s) => ({
        ...s,
        newsRead: s.newsRead.includes(action.id) ? s.newsRead : [...s.newsRead, action.id],
      }));
    case "LETTER":
      return patchUser(state, (s) => ({
        ...s,
        letters: s.letters.includes(action.name) ? s.letters : [...s.letters, action.name],
      }));
    case "GOV":
      return { ...state, governance: { ...state.governance, [action.id]: action.status } };
    case "COURSE":
      return patchUser(state, (s) => ({ ...s, courses: { ...s.courses, [action.id]: action.progress } }));
    case "ACK_ANN":
      return patchUser(state, (s) => ({
        ...s,
        annAck: s.annAck.includes(action.id) ? s.annAck : [...s.annAck, action.id],
        annSeen: s.annSeen.includes(action.id) ? s.annSeen : [...s.annSeen, action.id],
      }));
    case "DISMISS_ANN":
      return patchUser(state, (s) => ({
        ...s,
        annDismissed: s.annDismissed.includes(action.id) ? s.annDismissed : [...s.annDismissed, action.id],
        annSeen: s.annSeen.includes(action.id) ? s.annSeen : [...s.annSeen, action.id],
      }));
    case "SEEN_ANN":
      return patchUser(state, (s) => ({
        ...s,
        annSeen: s.annSeen.includes(action.id) ? s.annSeen : [...s.annSeen, action.id],
      }));
    case "PAUSE_ANN":
      return { ...state, annPaused: { ...state.annPaused, [action.id]: action.paused } };
    case "ASK_AMA":
      return patchUser(state, (s) => ({ ...s, amaAsked: [action.question, ...s.amaAsked] }));
    case "UPVOTE_AMA":
      return patchUser(state, (s) => ({
        ...s,
        amaUpvotes: s.amaUpvotes.includes(action.id)
          ? s.amaUpvotes.filter((x) => x !== action.id)
          : [...s.amaUpvotes, action.id],
      }));
    case "REGISTER_AMA":
      return patchUser(state, (s) => ({
        ...s,
        amaRegistered: s.amaRegistered.includes(action.id)
          ? s.amaRegistered.filter((x) => x !== action.id)
          : [...s.amaRegistered, action.id],
      }));
    default:
      return state;
  }
}

const KEY = "hccb-hub-v4";

const Ctx = createContext<{
  state: State;
  slice: UserSlice;
  dispatch: React.Dispatch<Action>;
  pendingCount: number;
  unread: number;
  user: Persona;
  ready: boolean;
  /** Live, targeted, not-yet-dismissed announcements for the signed-in user. */
  myAnnouncements: Announcement[];
  /** Highest-priority popup this user has not been served yet. */
  popupAnnouncement: Announcement | null;
  /** Mandatory notices still waiting on this user's acknowledgement. */
  needsAck: Announcement[];
  /** Every AMA question — seeded feed plus this user's own submissions. */
  amaFeed: AmaQuestion[];
} | null>(null);

export function HubProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) dispatch({ type: "HYDRATE", state: JSON.parse(raw) });
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(KEY, JSON.stringify({ ...state, toasts: [] }));
  }, [state, ready]);

  useEffect(() => {
    if (!state.toasts.length) return;
    const t = setTimeout(() => dispatch({ type: "DISMISS_TOAST", id: state.toasts[0].id }), 2600);
    return () => clearTimeout(t);
  }, [state.toasts]);

  useEffect(() => {
    document.documentElement.lang = state.language === "English" ? "en" : state.language === "हिन्दी" ? "hi" : "kn";
  }, [state.language]);

  const user = getPersona(state.userId);
  const slice = state.users[state.userId] ?? sliceFor(user);
  const pendingCount = isManager(user) ? state.approvals.filter((a) => a.status === "Pending").length : 0;
  const unread = slice.notifications.filter((n) => !n.read).length;

  const targeted = useMemo(
    () => liveAnnouncementsFor(user, undefined, state.annPaused),
    [user, state.annPaused]
  );
  const myAnnouncements = useMemo(
    () => targeted.filter((a) => !slice.annDismissed.includes(a.id)),
    [targeted, slice.annDismissed]
  );
  const popupAnnouncement = useMemo(
    () => targeted.find((a) => a.popup && !slice.annSeen.includes(a.id)) ?? null,
    [targeted, slice.annSeen]
  );
  const needsAck = useMemo(
    () => targeted.filter((a) => a.acknowledge && !slice.annAck.includes(a.id)),
    [targeted, slice.annAck]
  );
  const amaFeed = useMemo(() => [...slice.amaAsked, ...seedAmaQuestions], [slice.amaAsked]);

  const value = useMemo(
    () => ({
      state,
      slice,
      dispatch,
      pendingCount,
      unread,
      user,
      ready,
      myAnnouncements,
      popupAnnouncement,
      needsAck,
      amaFeed,
    }),
    [state, slice, pendingCount, unread, user, ready, myAnnouncements, popupAnnouncement, needsAck, amaFeed]
  );

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

export { defaultPersona as user };
