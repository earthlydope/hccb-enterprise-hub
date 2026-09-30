import { useState } from "react";
import { Icon } from "../ui";
import { personas } from "../personas";
import { toast, useHub } from "../store";

/** Desktop sign-in. Same three demo personas as the mobile app. */
export function WebLogin() {
  const { dispatch } = useHub();
  const [pick, setPick] = useState("ananya");
  const selected = personas.find((p) => p.id === pick) ?? personas[0];

  return (
    <div className="wl">
      <aside className="wl-pitch">
        <div className="wl-brand">
          <img src="/coca-cola.svg" alt="Coca-Cola" />
          <span>Hindustan Coca-Cola Beverages</span>
        </div>
        <h1>
          One digital front door for <em>5,000+</em> employees.
        </h1>
        <p>
          Corporate communications, employee services, knowledge, business applications and
          dashboards — reached from a single personalised home.
        </p>
        <ul>
          {[
            ["campaign", "Corporate communications", "CEO messages, announcements, townhalls"],
            ["badge", "Employee services", "Leave, payroll, letters, travel, IT helpdesk"],
            ["menu_book", "Knowledge management", "SOPs, policies, playbooks — current by construction"],
            ["monitoring", "Analytics", "Reach, open rate and read-through by zone and function"],
          ].map(([i, t, s]) => (
            <li key={t}>
              <span>
                <Icon name={i} size={18} />
              </span>
              <div>
                <b>{t}</b>
                <small>{s}</small>
              </div>
            </li>
          ))}
        </ul>
        <footer>
          Enterprise Experience Hub · <b>Syren Cloud</b>
        </footer>
      </aside>

      <main className="wl-form">
        <button className="wa-link-btn" onClick={() => dispatch({ type: "SET_MODE", mode: null })}>
          ← Back to experience chooser
        </button>
        <h2>Sign in</h2>
        <p className="wl-sub">
          Demo prototype — pick a persona to see how the hub personalises itself by lane, department
          and location.
        </p>

        <div className="wl-list">
          {personas.map((p) => (
            <button
              key={p.id}
              className={pick === p.id ? "wl-persona on" : "wl-persona"}
              onClick={() => setPick(p.id)}
            >
              <img src={p.avatar} alt="" />
              <div>
                <b>{p.fullName}</b>
                <small>
                  {p.lane} · {p.roleTitle}
                </small>
                <small>{p.blurb}</small>
              </div>
              <Icon name={pick === p.id ? "radio_button_checked" : "radio_button_unchecked"} />
            </button>
          ))}
        </div>

        <button
          className="wa-cta"
          style={{ width: "100%", justifyContent: "center", marginTop: 4 }}
          onClick={() => {
            dispatch({ type: "LOGIN", userId: selected.id });
            toast(dispatch, `Signed in as ${selected.fullName}`);
          }}
        >
          Continue as {selected.firstName} <Icon name="arrow_forward" size={17} />
        </button>
        <button
          className="wa-cta ghost"
          style={{ width: "100%", justifyContent: "center", marginTop: 10 }}
          onClick={() => toast(dispatch, "IT helpdesk: 1800-102-HCCB", "info")}
        >
          Need help signing in?
        </button>
        <p className="wl-note">
          <Icon name="lock" size={14} /> Single sign-on via Microsoft Entra ID · permission-trimmed
          content everywhere
        </p>
      </main>
    </div>
  );
}
