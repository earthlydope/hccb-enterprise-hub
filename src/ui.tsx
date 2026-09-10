import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useHub } from "./store";

export function Icon({ name, fill, size }: { name: string; fill?: boolean; size?: number }) {
  return (
    <span className={fill ? "ms fill" : "ms"} style={size ? { fontSize: size } : undefined}>
      {name}
    </span>
  );
}

export function StatusBar() {
  return (
    <div className="status-bar">
      <span className="time">9:41</span>
      <span aria-hidden="true" />
      <span className="signals">
        <Icon name="signal_cellular_alt" size={16} />
        <Icon name="wifi" size={16} />
        <Icon name="battery_full" size={16} />
      </span>
    </div>
  );
}

export function TopBar({ title = "Home" }: { title?: string }) {
  const nav = useNavigate();
  const { unread, user } = useHub();
  return (
    <header className="topbar">
      <div className="brand">
        <img src="/coca-cola.svg" alt="Coca-Cola" />
        <span className="nav-title">{title}</span>
      </div>
      <button className="icon-btn" aria-label="Search" onClick={() => nav("/search")}>
        <Icon name="search" />
      </button>
      <button className="icon-btn" aria-label="Notifications" onClick={() => nav("/notifications")}>
        <Icon name="notifications" />
        {unread > 0 && <span className="badge">{unread}</span>}
      </button>
      <button className="icon-btn" aria-label="Profile" onClick={() => nav("/profile")} style={{ padding: 0, background: "transparent" }}>
        <img className="avatar" src={user.avatar} alt={user.fullName} />
      </button>
    </header>
  );
}

const tabCopy: Record<string, Record<string, string>> = {
  English: { Home: "Home", Workspace: "Workspace", Services: "Services", "AI Copilot": "AI Copilot", Knowledge: "Knowledge" },
  हिन्दी: { Home: "होम", Workspace: "वर्कस्पेस", Services: "सेवाएँ", "AI Copilot": "कोपायलट", Knowledge: "ज्ञान" },
  ಕನ್ನಡ: { Home: "ಮುಖಪುಟ", Workspace: "ವರ್ಕ್‌ಸ್ಪೇಸ್", Services: "ಸೇವೆಗಳು", "AI Copilot": "ಕೋಪೈಲಟ್", Knowledge: "ಜ್ಞಾನ" },
};

const tabs = [
  { to: "/", icon: "home", label: "Home" },
  { to: "/workspace", icon: "business_center", label: "Workspace" },
  { to: "/services", icon: "grid_view", label: "Services" },
  { to: "/copilot", icon: "auto_awesome", label: "AI Copilot", spark: true },
  { to: "/knowledge", icon: "menu_book", label: "Knowledge" },
];

export function TabBar() {
  const loc = useLocation();
  const { state } = useHub();
  const dict = tabCopy[state.language] ?? tabCopy.English;
  return (
    <nav className="tabbar">
      {tabs.map((t) => {
        const active =
          t.to === "/"
            ? loc.pathname === "/"
            : loc.pathname === t.to || loc.pathname.startsWith(t.to + "/");
        return (
          <NavLink key={t.to} to={t.to} className={active ? "tab active" : "tab"}>
            <Icon name={t.icon} fill={active} />
            {t.spark && <i className="spark" />}
            {dict[t.label] ?? t.label}
          </NavLink>
        );
      })}
    </nav>
  );
}

export function ScreenHeader({ title, back }: { title: string; back?: boolean }) {
  const nav = useNavigate();
  return (
    <div className="topbar" style={{ paddingTop: 4 }}>
      {back !== false && (
        <button className="back" onClick={() => nav(-1)}>
          <Icon name="chevron_left" />
        </button>
      )}
      <h2 className="h2" style={{ flex: 1 }}>
        {title}
      </h2>
    </div>
  );
}

export function Empty({ text }: { text: string }) {
  return (
    <div className="card" style={{ textAlign: "center", color: "var(--muted)" }}>
      {text}
    </div>
  );
}
