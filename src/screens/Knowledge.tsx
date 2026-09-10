import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Icon, ScreenHeader, TopBar } from "../ui";
import { knowledgeDocs } from "../data";
import { toast, useHub } from "../store";

export function Knowledge() {
  const nav = useNavigate();
  const [type, setType] = useState("All");
  const types = ["All", "SOP", "Policy", "Playbook", "HR Document"];
  const list = knowledgeDocs.filter((d) => type === "All" || d.type === type);
  return (
    <>
      <TopBar title="Knowledge" />
      <div className="scroll">
        <h1 className="h1">Policies & SOPs</h1>
        <div className="filters">
          {types.map((t) => (
            <button key={t} className={type === t ? "filter on" : "filter"} onClick={() => setType(t)}>
              {t}
            </button>
          ))}
        </div>
        <div className="list">
          {list.map((d) => (
            <button key={d.id} className="list-item" onClick={() => nav(`/knowledge/${d.id}`)}>
              <Icon name="description" />
              <div style={{ flex: 1, textAlign: "left" }}>
                <h4>{d.title}</h4>
                <div className="tiny">
                  {d.type} · {d.department} · {d.updated}
                </div>
              </div>
              <Icon name="chevron_right" />
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

export function KnowledgeDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const { state, dispatch } = useHub();
  const doc = knowledgeDocs.find((d) => d.id === id);
  const [acked, setAcked] = useState(false);
  if (!doc) {
    return (
      <>
        <ScreenHeader title="Document" />
        <div className="scroll">Not found or you do not have access.</div>
      </>
    );
  }
  const saved = state.bookmarks.includes(doc.id);
  return (
    <>
      <ScreenHeader title={doc.type} />
      <div className="scroll">
        <div className="card">
          <h2 className="h2">{doc.title}</h2>
          <p className="tiny">
            Owner {doc.owner} · {doc.version} · Updated {doc.updated} · Reviewed {doc.reviewed} · {doc.source}
          </p>
          <div className="row" style={{ marginTop: 10 }}>
            <button
              className="cta small ghost"
              onClick={() => {
                dispatch({ type: "TOGGLE_BOOKMARK", id: doc.id });
                toast(dispatch, saved ? "Bookmark removed" : "Bookmarked");
              }}
            >
              {saved ? "Bookmarked" : "Bookmark"}
            </button>
            <button className="cta small ghost" onClick={() => nav(`/copilot?q=${encodeURIComponent("Summarize " + doc.title)}`)}>
              AI summary
            </button>
          </div>
        </div>
        <div className="section-title">
          <h3>Contents</h3>
        </div>
        <div className="card">
          {doc.body.map((p, i) => (
            <p key={i} style={{ fontSize: 14, lineHeight: 1.5 }}>
              {i + 1}. {p}
            </p>
          ))}
        </div>
        <button
          className="cta"
          disabled={acked}
          onClick={() => {
            setAcked(true);
            toast(dispatch, "Acknowledgement recorded");
          }}
        >
          {acked ? "Acknowledged" : "I have read this SOP"}
        </button>
        <div className="section-title">
          <h3>Related</h3>
        </div>
        {doc.related.map((rid) => {
          const r = knowledgeDocs.find((d) => d.id === rid);
          if (!r) return null;
          return (
            <button key={rid} className="list-item" onClick={() => nav(`/knowledge/${rid}`)}>
              <Icon name="link" />
              <div>
                <h4>{r.title}</h4>
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
}
