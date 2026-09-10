import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useHub, user } from "./store";

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
      <span>9:41</span>
      <span style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <Icon name="signal_cellular_alt" size={16} />
        <Icon name="wifi" size={16} />
        <Icon name="battery_full" size={16} />
      </span>
    </div>
  );
}

export function TopBar({ title = "Home" }: { title?: string }) {
  const nav = useNavigate();
  const { unread } = useHub();
  return (
    <header className="topbar">
      <div className="brand">
        <img src="/coca-cola.svg" alt="Coca-Cola" />
        <div className="meta">
          <b>HCCB HUB</b>
          <span>{title}</span>
        </div>
      </div>
      <button className="icon-btn" aria-label="Search" onClick={() => nav("/search")}>
        <Icon name="search" />
      </button>
      <button className="icon-btn" aria-label="Notifications" onClick={() => nav("/notifications")}>
        <Icon name="notifications" />
        {unread > 0 && <span className="badge">{unread}</span>}
      </button>
      <button className="icon-btn" aria-label="Profile" onClick={() => nav("/profile")} style={{ padding: 0 }}>
        <img className="avatar" src={user.avatar} alt="" />
      </button>
    </header>
  );
}

const tabs = [
  { to: "/", icon: "home", label: "Home" },
  { to: "/workspace", icon: "work", label: "Workspace" },
  { to: "/services", icon: "apps", label: "Services" },
  { to: "/copilot", icon: "auto_awesome", label: "AI Copilot", spark: true },
  { to: "/knowledge", icon: "menu_book", label: "Knowledge" },
];

export function TabBar() {
  const loc = useLocation();
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
            {t.label}
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
