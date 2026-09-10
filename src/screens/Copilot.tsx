import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Icon, TopBar } from "../ui";
import { copilotAnswer, knowledgeDocs } from "../data";
import { useHub } from "../store";

const starters = [
  "What is my leave balance?",
  "What is the travel policy?",
  "Plant safety SOP",
  "How do I raise an IT ticket?",
];

export function Copilot() {
  const [params] = useSearchParams();
  const { slice, dispatch, user, pendingCount } = useHub();
  const nav = useNavigate();
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const boot = useRef(false);

  const ask = (text: string) => {
    const q = text.trim();
    if (!q || typing) return;
    const res = copilotAnswer(q, user, pendingCount);
    dispatch({ type: "COPILOT", msg: { role: "user", text: q } });
    setInput("");
    setTyping(true);
    window.setTimeout(() => {
      dispatch({
        type: "COPILOT",
        msg: { role: "assistant", text: res.answer, sources: res.sources, actions: res.actions },
      });
      setTyping(false);
    }, 700);
  };

  useEffect(() => {
    const q = params.get("q");
    if (q && !boot.current) {
      boot.current = true;
      ask(q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  return (
    <>
      <TopBar title="AI Copilot" />
      <div className="scroll" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div className="between">
          <div>
            <div className="kicker">Knowledge assistant</div>
            <h1 className="h1" style={{ fontSize: 22 }}>
            Hello {user.firstName} — ask in plain language
            </h1>
          </div>
          <button className="link" onClick={() => dispatch({ type: "CLEAR_COPILOT" })}>
            New chat
          </button>
        </div>
        {slice.copilot.length === 0 &&
          !typing &&
          starters.map((s) => (
            <button key={s} className="list-item" onClick={() => ask(s)}>
              <Icon name="auto_awesome" />
              <div>
                <h4>{s}</h4>
              </div>
            </button>
          ))}
        {slice.copilot.map((m, i) => (
          <div key={i} className={m.role === "user" ? "bubble me" : "bubble bot"}>
            {m.text}
            {m.sources?.map((sid) => {
              const d = knowledgeDocs.find((x) => x.id === sid);
              if (!d) return null;
              return (
                <button key={sid} className="src" style={{ display: "block", width: "100%", textAlign: "left" }} onClick={() => nav(`/knowledge/${sid}`)}>
                  Source · {d.title} · {d.version}
                </button>
              );
            })}
            {m.actions?.map((a) => (
              <button key={a.to} className="link" style={{ display: "block", marginTop: 8 }} onClick={() => nav(a.to)}>
                {a.label}
              </button>
            ))}
          </div>
        ))}
        {typing && (
          <div className="bubble bot typing">
            <span />
            <span />
            <span />
          </div>
        )}
        <form
          className="searchbar"
          onSubmit={(e) => {
            e.preventDefault();
            ask(input);
          }}
        >
          <Icon name="auto_awesome" size={18} />
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about policies, leaves or tickets" />
          <button className="send" type="submit">
            <Icon name="arrow_forward" size={16} />
          </button>
        </form>
        <p className="tiny">Answers use your leave balance and role. Transactional requests are confirmed before submit.</p>
      </div>
    </>
  );
}
