import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { StatusBar, TabBar } from "./ui";
import { useHub } from "./store";
import { Login } from "./screens/Login";
import { Home } from "./screens/Home";
import { Workspace, Payslips, ApprovalDetail } from "./screens/Workspace";
import {
  Services,
  LeaveForm,
  TicketForm,
  TravelForm,
  Jobs,
  JobDetail,
  Letters,
  Attendance,
} from "./screens/Services";
import { Knowledge, KnowledgeDetail } from "./screens/Knowledge";
import { Search } from "./screens/Search";
import { Copilot } from "./screens/Copilot";
import {
  Admin,
  Analytics,
  Apps,
  AppLaunch,
  Communities,
  HubPage,
  Learning,
  News,
  NewsDetail,
  Notifications,
  Profile,
  Recognition,
} from "./screens/More";

function Shell() {
  const { state, ready } = useHub();
  const loc = useLocation();
  if (!ready) return null;
  if (!state.session) return <Navigate to="/login" replace />;
  const hideTabs = ["/login"].includes(loc.pathname);
  return (
    <div className="app">
      <StatusBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/workspace" element={<Workspace />} />
        <Route path="/workspace/payslips" element={<Payslips />} />
        <Route path="/approvals/:id" element={<ApprovalDetail />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/leave" element={<LeaveForm />} />
        <Route path="/services/it" element={<TicketForm />} />
        <Route path="/services/travel" element={<TravelForm />} />
        <Route path="/services/jobs" element={<Jobs />} />
        <Route path="/services/jobs/:id" element={<JobDetail />} />
        <Route path="/services/letters" element={<Letters />} />
        <Route path="/services/attendance" element={<Attendance />} />
        <Route path="/knowledge" element={<Knowledge />} />
        <Route path="/knowledge/:id" element={<KnowledgeDetail />} />
        <Route path="/search" element={<Search />} />
        <Route path="/copilot" element={<Copilot />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/apps" element={<Apps />} />
        <Route path="/apps/:id" element={<AppLaunch />} />
        <Route path="/news" element={<News />} />
        <Route path="/news/:id" element={<NewsDetail />} />
        <Route path="/learning" element={<Learning />} />
        <Route path="/communities" element={<Communities />} />
        <Route path="/recognition" element={<Recognition />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/sales" element={<HubPage kind="sales" />} />
        <Route path="/manufacturing" element={<HubPage kind="mfg" />} />
        <Route path="/supply-chain" element={<HubPage kind="sc" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!hideTabs && <TabBar />}
      <Toasts />
    </div>
  );
}

function Toasts() {
  const { state } = useHub();
  if (!state.toasts.length) return null;
  return (
    <div className="toast-wrap">
      {state.toasts.map((t) => (
        <div key={t.id} className="toast">
          {t.text}
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const nav = useNavigate();
  const { state, ready } = useHub();
  return (
    <div className="stage">
      <div className="device">
        <div className="device-screen">
          <div className="device-notch" />
          <Routes>
            <Route
              path="/login"
              element={
                !ready ? null : state.session ? <Navigate to="/" replace /> : <Login onIn={() => nav("/")} />
              }
            />
            <Route path="/*" element={<Shell />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
