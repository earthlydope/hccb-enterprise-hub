import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Icon, TopBar } from "../ui";
import { copilotAnswer, knowledgeDocs } from "../data";
import { useHub } from "../store";

const starters = [
  "What is the travel policy?",
  "How do I apply for transfer?",
  "What are Q4 sales targets?",
  "Show me onboarding documents.",
];

export function Copilot() {
  const [params] = useSearchParams();
  const { state, dispatch } = useHub();
  const nav = useNavigate();
  const [input, setInput] = useState("");
  const boot = useRef(false);

  const ask = (text: string) => {
    const q = text.trim();
    if (!q) return;
    const res = copilotAnswer(q);
    dispatch({ type: "COPILOT", msg: { role: "user", text: q } });
    dispatch({
      type: "COPILOT",
      msg: { role: "assistant", text: res.answer, sources: res.sources, actions: res.actions },
    });
    setInput("");
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
            <div className="kicker">HCCB KNOWLEDGE ASSISTANT</div>
            <h1 className="h1" style={{ fontSize: 22 }}>
              Ask in plain language
            </h1>
          </div>
          <button className="link" onClick={() => dispatch({ type: "CLEAR_COPILOT" })}>
            New chat
          </button>
        </div>
        {state.copilot.length === 0 &&
          starters.map((s) => (
            <button key={s} className="list-item" onClick={() => ask(s)}>
              <Icon name="auto_awesome" />
              <div>
                <h4>{s}</h4>
              </div>
            </button>
          ))}
        {state.copilot.map((m, i) => (
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
        <form
          className="searchbar"
          onSubmit={(e) => {
            e.preventDefault();
            ask(input);
          }}
        >
          <Icon name="auto_awesome" size={18} />
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about policies, leaves or sales" />
          <button className="send" type="submit">
            <Icon name="arrow_forward" size={16} />
          </button>
        </form>
        <p className="tiny">Answers cite HCCB sources. Transactional requests are confirmed before submit.</p>
      </div>
    </>
  );
}
