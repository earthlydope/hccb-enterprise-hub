import { useNavigate } from "react-router-dom";
import { toast, useHub, user } from "../store";

export function Login({ onIn }: { onIn: () => void }) {
  const { dispatch } = useHub();
  const nav = useNavigate();
  return (
    <div className="app">
      <div className="login">
        <img src="/coca-cola.svg" alt="Coca-Cola" style={{ height: 42, marginBottom: 12 }} />
        <div className="kicker">HCCB ENTERPRISE HUB</div>
        <h1 className="h1" style={{ fontSize: 26 }}>
          Welcome to HCCB Hub
        </h1>
        <p className="muted">
          One place for your work, services, knowledge and updates.
        </p>
        <div className="card" style={{ marginTop: 18 }}>
          <div className="row" style={{ gap: 10 }}>
            <img className="avatar" src={user.avatar} alt="" />
            <div>
              <b>{user.fullName}</b>
              <div className="tiny">{user.email}</div>
            </div>
          </div>
          <button
            className="cta"
            onClick={() => {
              dispatch({ type: "LOGIN" });
              toast(dispatch, "Signed in with work account");
              onIn();
              nav("/");
            }}
          >
            Continue with work account
          </button>
          <button
            className="cta ghost"
            onClick={() => toast(dispatch, "IT helpdesk: 1800-102-HCCB", "info")}
          >
            Need help signing in?
          </button>
        </div>
        <p className="tiny" style={{ textAlign: "center", marginTop: 18 }}>
          Demo prototype · session stays on this device
        </p>
      </div>
    </div>
  );
}
