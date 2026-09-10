import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { personas } from "../personas";
import { toast, useHub } from "../store";

export function Login({ onIn }: { onIn: () => void }) {
  const { dispatch } = useHub();
  const nav = useNavigate();
  const [pick, setPick] = useState("avinash");
  const selected = personas.find((p) => p.id === pick) ?? personas[0];

  return (
    <div className="app">
      <div className="login">
        <img src="/coca-cola.svg" alt="Coca-Cola" style={{ height: 36, marginBottom: 10 }} />
        <div className="kicker">HCCB Enterprise Hub</div>
        <h1 className="h1">
          Choose a user
        </h1>
        <p className="muted">Three lanes: Corporate + Admin, Plant floor, and Employee Support.</p>
        <div className="persona-list">
          {personas.map((p) => (
            <button
              key={p.id}
              data-hint={`login-${p.id}`}
              className={pick === p.id ? "persona-pick on" : "persona-pick"}
              onClick={() => setPick(p.id)}
            >
              <img className="avatar" src={p.avatar} alt="" />
              <div>
                <b>{p.fullName}</b>
                <small>{p.lane} · {p.roleTitle}</small>
                <small>{p.blurb}</small>
              </div>
            </button>
          ))}
        </div>
        <button
          className="cta"
          data-hint="login-go"
          onClick={() => {
            dispatch({ type: "LOGIN", userId: selected.id });
            toast(dispatch, `Signed in as ${selected.fullName}`);
            onIn();
            nav("/");
          }}
        >
          Continue as {selected.firstName}
        </button>
        <button className="cta ghost" onClick={() => toast(dispatch, "IT helpdesk: 1800-102-HCCB", "info")}>
          Need help signing in?
        </button>
        <p className="tiny" style={{ textAlign: "center", marginTop: 14 }}>
          Demo prototype · Corporate, Plant, and Support
        </p>
      </div>
    </div>
  );
}
