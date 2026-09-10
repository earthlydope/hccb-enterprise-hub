import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Icon, ScreenHeader } from "../ui";
import { apps, knowledgeDocs, newsItems, copilotAnswer } from "../data";
import { useHub } from "../store";

const filters = ["All", "Policies & SOPs", "News", "People", "Applications", "Learning"];

export function Search() {
  const [params] = useSearchParams();
  const { state, dispatch } = useHub();
  const nav = useNavigate();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [facet, setFacet] = useState("All");
  const query = q.trim().toLowerCase();

  const results = useMemo(() => {
    if (!query) return [];
    const docs = knowledgeDocs
      .filter((d) => `${d.title} ${d.snippet} ${d.body.join(" ")}`.toLowerCase().includes(query))
      .map((d) => ({
        kind: "Policies & SOPs",
        title: d.title,
        snippet: d.snippet,
        source: d.source,
        updated: d.updated,
        to: `/knowledge/${d.id}`,
      }));
    const news = newsItems
      .filter((n) => `${n.title} ${n.body}`.toLowerCase().includes(query))
      .map((n) => ({
        kind: "News",
        title: n.title,
        snippet: n.body,
        source: "SharePoint",
        updated: n.time,
        to: `/news/${n.id}`,
      }));
    const people =
      "avinash priya manager sales".includes(query) || query.includes("avinash") || query.includes("people")
        ? [
            {
              kind: "People",
              title: "Avinash B M",
              snippet: "Business Manager · Field Sales Operations · Bengaluru Plant",
              source: "Directory",
              updated: "Live",
              to: "/profile",
            },
          ]
        : [];
    const applications = apps
      .filter((a) => `${a.name} ${a.subtitle}`.toLowerCase().includes(query))
      .map((a) => ({
        kind: "Applications",
        title: a.name,
        snippet: a.subtitle,
        source: "App launcher",
        updated: "SSO",
        to: `/apps/${a.id}`,
      }));
    const learning = query.includes("learn") || query.includes("training") || query.includes("conduct")
      ? [
          {
            kind: "Learning",
            title: "Code of Business Conduct",
            snippet: "Required module · completed",
            source: "LMS",
            updated: "This week",
            to: "/learning",
          },
        ]
      : [];
    const all = [...docs, ...news, ...people, ...applications, ...learning];
    return facet === "All" ? all : all.filter((r) => r.kind === facet);
  }, [query, facet]);

  const overview = query ? copilotAnswer(query) : null;

  return (
    <>
      <ScreenHeader title="Search" />
      <div className="scroll">
        <form
          className="searchbar"
          onSubmit={(e) => {
            e.preventDefault();
            dispatch({ type: "SEARCH", q });
          }}
        >
          <Icon name="search" size={18} />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search policies, SOPs, people, news, apps"
          />
        </form>
        <div className="filters">
          {filters.map((f) => (
            <button key={f} className={facet === f ? "filter on" : "filter"} onClick={() => setFacet(f)}>
              {f}
            </button>
          ))}
        </div>
        {!query && (
          <>
            <div className="tiny">Recent</div>
            {state.searchHistory.map((s) => (
              <button
                key={s}
                className="list-item"
                onClick={() => {
                  setQ(s);
                  dispatch({ type: "SEARCH", q: s });
                }}
              >
                <Icon name="history" />
                <div>
                  <h4>{s}</h4>
                </div>
              </button>
            ))}
          </>
        )}
        {query && overview && (
          <div className="card" style={{ marginBottom: 12 }}>
            <div className="tiny">AI OVERVIEW</div>
            <p style={{ fontSize: 14 }}>{overview.answer}</p>
            <button className="link" onClick={() => nav(`/copilot?q=${encodeURIComponent(q)}`)}>
              Open in Copilot
            </button>
          </div>
        )}
        {query && results.length === 0 && (
          <div className="card muted">No results. Try “Leave policy” or “Plant safety SOP”.</div>
        )}
        {results.map((r) => (
          <button
            key={r.title}
            className="list-item"
            onClick={() => {
              dispatch({ type: "SEARCH", q });
              nav(r.to);
            }}
          >
            <Icon name="find_in_page" />
            <div style={{ textAlign: "left", flex: 1 }}>
              <h4>{r.title}</h4>
              <div className="tiny">
                {r.kind} · {r.source} · {r.updated}
              </div>
              <div className="muted">{r.snippet}</div>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}
