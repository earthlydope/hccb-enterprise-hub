import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon, ScreenHeader } from "../ui";
import { amaSessions, amaTopics, ceo, type AmaQuestion } from "../data";
import { toast, useHub } from "../store";

function upvoteCount(q: AmaQuestion, upvoted: boolean) {
  return q.upvotes + (upvoted ? 1 : 0);
}

function sortByVotes(list: AmaQuestion[], upvotes: string[]) {
  return [...list].sort((a, b) => upvoteCount(b, upvotes.includes(b.id)) - upvoteCount(a, upvotes.includes(a.id)));
}

/* ------------------------------------------------------------------ *
 * Home card — CEO Talks · Ask Me Anything
 * ------------------------------------------------------------------ */
export function CeoTalksCard() {
  const nav = useNavigate();
  const { amaFeed, slice, dispatch, user } = useHub();
  const [q, setQ] = useState("");
  const session = amaSessions[0];
  const open = sortByVotes(
    amaFeed.filter((x) => x.sessionId === session.id),
    slice.amaUpvotes
  );
  const top = open[0];
  const asked = slice.amaAsked.filter((x) => x.sessionId === session.id).length;

  const submit = () => {
    const text = q.trim();
    if (!text) return;
    dispatch({
      type: "ASK_AMA",
      question: {
        id: crypto.randomUUID(),
        sessionId: session.id,
        author: user.fullName,
        role: user.roleTitle,
        lane: user.lane,
        topic: "Culture",
        text,
        upvotes: 1,
        status: "Pending",
        mine: true,
      },
    });
    setQ("");
    toast(dispatch, "Question sent to the CEO desk");
    nav("/ceo-talks");
  };

  return (
    <section data-hint="home-ceo">
      <div className="section-title">
        <h3>CEO Talks</h3>
        <button className="link" onClick={() => nav("/ceo-talks")}>
          All sessions
        </button>
      </div>
      <div className="ceo-card">
        <div className="ceo-head">
          <img src={ceo.avatar} alt={ceo.name} />
          <div>
            <b>{ceo.name}</b>
            <small>{ceo.title}</small>
          </div>
          <span className="ceo-live">
            <i /> {session.status === "Live" ? "LIVE NOW" : "QUESTIONS OPEN"}
          </span>
        </div>
        <h3>Ask Me Anything</h3>
        <p className="ceo-sub">
          {session.when} · {session.channel}. Most upvoted questions get answered live.
        </p>
        <form
          className="ceo-ask"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <Icon name="help" size={18} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`Ask ${ceo.name.split(" ")[0]} a question…`}
          />
          <button className="send" type="submit" aria-label="Send question" data-hint="home-ceo-ask">
            <Icon name="arrow_forward" size={16} />
          </button>
        </form>
        {top && (
          <button className="ceo-top" onClick={() => nav("/ceo-talks")}>
            <span>TOP QUESTION · {upvoteCount(top, slice.amaUpvotes.includes(top.id))} UPVOTES</span>
            {top.text}
          </button>
        )}
        <div className="ceo-meta">
          <span>
            <b>{open.length}</b> questions
          </span>
          <span>
            <b>{session.registered.toLocaleString("en-IN")}</b> registered
          </span>
          <span>
            <b>{asked}</b> from you
          </span>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * Full screen — sessions, ask box, upvoting, answered archive
 * ------------------------------------------------------------------ */
const tabs = ["Top", "Answered", "My questions"] as const;

export function CeoTalks() {
  const { amaFeed, slice, dispatch, user } = useHub();
  const [sessionId, setSessionId] = useState(amaSessions[0].id);
  const [tab, setTab] = useState<(typeof tabs)[number]>("Top");
  const [text, setText] = useState("");
  const [topic, setTopic] = useState(amaTopics[0]);
  const [anon, setAnon] = useState(false);

  const session = amaSessions.find((s) => s.id === sessionId) ?? amaSessions[0];
  const registered = slice.amaRegistered.includes(session.id);

  const questions = useMemo(() => {
    const all = amaFeed.filter((q) => q.sessionId === session.id);
    if (tab === "Answered") return all.filter((q) => q.status === "Answered");
    if (tab === "My questions") return all.filter((q) => q.mine);
    return sortByVotes(all, slice.amaUpvotes);
  }, [amaFeed, session.id, tab, slice.amaUpvotes]);

  const submit = () => {
    const body = text.trim();
    if (!body) return;
    dispatch({
      type: "ASK_AMA",
      question: {
        id: crypto.randomUUID(),
        sessionId: session.id,
        author: anon ? "Anonymous" : user.fullName,
        role: anon ? user.department : user.roleTitle,
        lane: user.lane,
        topic,
        text: body,
        upvotes: 1,
        status: "Pending",
        mine: true,
      },
    });
    setText("");
    toast(dispatch, anon ? "Question sent anonymously" : "Question sent to the CEO desk");
    setTab("My questions");
  };

  return (
    <>
      <ScreenHeader title="CEO Talks" />
      <div className="scroll">
        <div className="filters">
          {amaSessions.map((s) => (
            <button
              key={s.id}
              className={s.id === sessionId ? "filter on" : "filter"}
              onClick={() => {
                setSessionId(s.id);
                setTab(s.questionsOpen ? "Top" : "Answered");
              }}
            >
              {s.status === "Replay" ? "Replay · " : ""}
              {s.title.split(" · ")[0]}
            </button>
          ))}
        </div>

        <div className="ceo-card">
          <div className="ceo-head">
            <img src={ceo.avatar} alt={ceo.name} />
            <div>
              <b>{ceo.name}</b>
              <small>{ceo.title}</small>
            </div>
            <span className="ceo-live">
              <i /> {session.status.toUpperCase()}
            </span>
          </div>
          <h3>Ask Me Anything · {session.title.split(" · ")[0]}</h3>
          <p className="ceo-sub">
            {session.when} · {session.channel}
          </p>
          <p className="ceo-sub">{session.summary}</p>
          <div className="pa-why">
            {session.topics.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
          <div className="ceo-meta">
            <span>
              <b>{amaFeed.filter((q) => q.sessionId === session.id).length}</b> questions
            </span>
            <span>
              <b>{session.registered.toLocaleString("en-IN")}</b> registered
            </span>
          </div>
          <button
            className="pa-go"
            style={{ alignSelf: "flex-start" }}
            data-hint="ceo-register"
            onClick={() => {
              dispatch({ type: "REGISTER_AMA", id: session.id });
              toast(
                dispatch,
                registered ? "Removed from your calendar" : session.status === "Replay" ? "Replay opening" : "Added to your calendar"
              );
            }}
          >
            <Icon name={session.status === "Replay" ? "play_circle" : registered ? "event_available" : "event"} size={16} />
            {session.status === "Replay" ? "Watch replay" : registered ? "Registered" : "Register & remind me"}
          </button>
        </div>

        {session.questionsOpen && (
          <div className="card" style={{ marginTop: 12 }}>
            <div className="tiny">ASK A QUESTION</div>
            <div className="field" style={{ marginTop: 8, marginBottom: 8 }}>
              <textarea
                rows={3}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={`No filter. Ask ${ceo.name.split(" ")[0]} anything about the business.`}
              />
            </div>
            <div className="filters" style={{ paddingBottom: 8 }}>
              {amaTopics.map((t) => (
                <button key={t} className={topic === t ? "filter on" : "filter"} onClick={() => setTopic(t)}>
                  {t}
                </button>
              ))}
            </div>
            <div className="between">
              <button className="chip" onClick={() => setAnon((v) => !v)}>
                <Icon name={anon ? "check_box" : "check_box_outline_blank"} size={16} /> Ask anonymously
              </button>
              <button className="mini solid" data-hint="ceo-submit" disabled={!text.trim()} onClick={submit}>
                Send question
              </button>
            </div>
            <p className="tiny" style={{ marginTop: 8 }}>
              Top-voted questions are answered live. Everything else gets a written reply within a week.
            </p>
          </div>
        )}

        <div className="filters" style={{ marginTop: 14 }}>
          {tabs.map((t) => (
            <button key={t} className={tab === t ? "filter on" : "filter"} onClick={() => setTab(t)}>
              {t}
            </button>
          ))}
        </div>

        {questions.length === 0 && (
          <div className="card muted">
            {tab === "My questions" ? "You have not asked anything in this session yet." : "Nothing here yet."}
          </div>
        )}
        {questions.map((q) => {
          const on = slice.amaUpvotes.includes(q.id);
          return (
            <div key={q.id} className="ama-q">
              <button
                className={on ? "vote on" : "vote"}
                data-hint="ceo-vote"
                onClick={() => dispatch({ type: "UPVOTE_AMA", id: q.id })}
                aria-label="Upvote question"
              >
                <Icon name="keyboard_arrow_up" size={16} />
                {upvoteCount(q, on)}
              </button>
              <div className="q-body">
                <div className="ann-meta">
                  <span className="tag">{q.topic}</span>
                  {q.status === "Answered" && <span className="tag done">Answered</span>}
                  {q.status === "Shortlisted" && <span className="tag high">Shortlisted</span>}
                  {q.mine && <span className="tag dark">You</span>}
                </div>
                <p>{q.text}</p>
                <div className="tiny" style={{ marginTop: 6 }}>
                  {q.author} · {q.role}
                </div>
                {q.answer && (
                  <div className="ama-answer">
                    <b>
                      <img src={ceo.avatar} alt="" /> {ceo.name} · {q.answeredAt}
                    </b>
                    {q.answer}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
