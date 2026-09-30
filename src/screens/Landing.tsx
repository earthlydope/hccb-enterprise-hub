import { useHub } from "../store";
import { Icon } from "../ui";

/**
 * Entry chooser. Two ways into the same hub — the mobile experience for the
 * deskless majority, and the web experience for desks and support centres.
 * Picking either drops straight into the full application.
 */
export function Landing() {
  const { dispatch } = useHub();
  const enter = (mode: "mobile" | "web") => dispatch({ type: "SET_MODE", mode });

  return (
    <div className="lz">
      <header className="lz-top">
        <div className="lz-brand">
          <img src="/coca-cola.svg" alt="Coca-Cola" />
          <span>Hindustan Coca-Cola Beverages</span>
        </div>
        <span className="lz-by">
          Enterprise Experience Hub · <b>Syren Cloud</b>
        </span>
      </header>

      <section className="lz-hero">
        <span className="lz-eyebrow">One digital front door</span>
        <h1>
          Every employee starts the day in <em>one place</em> that knows who they are.
        </h1>
        <p>
          Corporate communications, employee services, knowledge, business applications and
          dashboards — reached from a single personalised home. Choose how you want to see it.
        </p>
        <div className="lz-scale">
          <div>
            <b>5,000+</b>
            <span>Employees</span>
          </div>
          <div>
            <b>14</b>
            <span>Factories</span>
          </div>
          <div>
            <b>12</b>
            <span>States</span>
          </div>
          <div>
            <b>32</b>
            <span>Warehouses</span>
          </div>
        </div>
      </section>

      <section className="lz-picker">
        {/* ---- Mobile ---- */}
        <button className="lz-card" data-hint="lz-mobile" onClick={() => enter("mobile")}>
          <div className="lz-card-head">
            <span className="lz-tag">
              <Icon name="smartphone" size={15} /> Mobile app
            </span>
            <span className="lz-pill">Primary device</span>
          </div>
          <h2>For the deskless majority</h2>
          <p>
            Factory, warehouse and market colleagues — approvals, SOPs, payslips, announcements
            and recognition in the flow of a shift.
          </p>

          <div className="lz-stage lz-stage-m">
            <div className="mini-phone">
              <div className="mini-notch" />
              <div className="mini-phone-bar">
                <span>9:41</span>
                <i />
              </div>
              <div className="mini-phone-body">
                <div className="mini-greet">
                  <span>Good morning</span>
                  <b>Avinash</b>
                </div>
                <div className="mini-hero">
                  <span>For you · Approver</span>
                  <b>8 approvals waiting</b>
                  <i className="mini-btn">Review</i>
                </div>
                <div className="mini-row">
                  <em />
                  <div>
                    <i className="w70" />
                    <i className="w40" />
                  </div>
                </div>
                <div className="mini-row">
                  <em className="amber" />
                  <div>
                    <i className="w60" />
                    <i className="w35" />
                  </div>
                </div>
                <div className="mini-ceo">
                  <span>CEO TALKS</span>
                  <b>Ask Me Anything</b>
                </div>
              </div>
              <div className="mini-tabs">
                <i className="on" />
                <i />
                <i />
                <i />
                <i />
              </div>
            </div>
          </div>

          <div className="lz-feat">
            <span>Shift-ready</span>
            <span>Offline SOPs</span>
            <span>Push announcements</span>
          </div>
          <span className="lz-go">
            Enter mobile experience <Icon name="arrow_forward" size={18} />
          </span>
        </button>

        {/* ---- Web ---- */}
        <button className="lz-card" data-hint="lz-web" onClick={() => enter("web")}>
          <div className="lz-card-head">
            <span className="lz-tag">
              <Icon name="desktop_windows" size={15} /> Web application
            </span>
            <span className="lz-pill">Support centres</span>
          </div>
          <h2>For desks and leadership</h2>
          <p>
            The full intranet — news and leadership corner, department hubs, policy libraries,
            and the communications analytics behind every story.
          </p>

          <div className="lz-stage lz-stage-w">
            <div className="mini-web">
              <div className="mini-web-bar">
                <i className="dot r" />
                <i className="dot y" />
                <i className="dot g" />
                <span>hub.hccb.co.in</span>
              </div>
              <div className="mini-web-body">
                <div className="mini-side">
                  <i className="on" />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                </div>
                <div className="mini-main">
                  <div className="mini-banner">
                    <b>Good morning, Avinash</b>
                    <span>Bengaluru HQ · Corporate Operations</span>
                  </div>
                  <div className="mini-grid">
                    <div className="mini-tile tall">
                      <i className="w50" />
                      <div className="mini-bars">
                        <u style={{ height: "42%" }} />
                        <u style={{ height: "68%" }} />
                        <u style={{ height: "88%" }} />
                        <u style={{ height: "56%" }} />
                        <u style={{ height: "74%" }} />
                      </div>
                    </div>
                    <div className="mini-tile">
                      <i className="w60" />
                      <i className="w35" />
                    </div>
                    <div className="mini-tile">
                      <i className="w45" />
                      <i className="w70" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lz-feat">
            <span>Comms analytics</span>
            <span>Leadership corner</span>
            <span>Department hubs</span>
          </div>
          <span className="lz-go">
            Enter web experience <Icon name="arrow_forward" size={18} />
          </span>
        </button>
      </section>

      <footer className="lz-foot">
        <div className="lz-pillars">
          {[
            ["campaign", "Corporate communications"],
            ["badge", "Employee services"],
            ["groups", "Collaboration"],
            ["menu_book", "Knowledge management"],
            ["emoji_events", "Engagement & recognition"],
            ["monitoring", "Applications & analytics"],
          ].map(([icon, label]) => (
            <span key={label}>
              <Icon name={icon} size={16} /> {label}
            </span>
          ))}
        </div>
        <p>
          Same content, same identity, same governance — one authored experience rendered for the
          device in hand.
        </p>
      </footer>
    </div>
  );
}
