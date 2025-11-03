// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { 
  FaThLarge, FaUsers, FaCalendarAlt, FaCommentAlt, 
  FaBook, FaCog, FaTasks, FaChartBar, FaCheckSquare,
  FaUserMd, FaCommentDots, FaUsersCog
} from 'react-icons/fa';

// --- Main Site Pages ---
import LandingPage from './pages/LandingPage';
import RoleSelectionPage from './pages/RoleSelectionPage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import CancerInfoPage from './pages/CancerInfoPage'; // Make sure this is imported

// --- Counselor Dashboard ---
import DashboardLayout from './dashboard/DashboardLayout';
import Overview from './dashboard/pages/Overview';
import MyPatients from './dashboard/pages/MyPatients';
import SessionManagement from './dashboard/pages/SessionManagement';
import Messages from './dashboard/pages/Messages';
import ResourceLibrary from './dashboard/pages/ResourceLibrary';
import Settings from './dashboard/pages/Settings';

// --- Admin Dashboard ---
import AdminLayout from './admin/AdminLayout';
import AdminOverview from './admin/pages/AdminOverview';
import UserManagement from './admin/pages/UserManagement';
import SessionOversight from './admin/pages/SessionOversight';
import ReportsAndInsights from './admin/pages/ReportsAndInsights';
import AdminResourceMgt from './admin/pages/AdminResourceMgt';
import ApprovalCenter from './admin/pages/ApprovalCenter';
import AdminMessages from './admin/pages/AdminMessages';
import AdminSettings from './admin/pages/AdminSettings';

// --- Patient Dashboard ---
import PatientOverview from './patient/pages/PatientOverview';
import CounsellorList from './patient/pages/CounsellorList';
import PatientResources from './patient/pages/PatientResources';
import PatientSessions from './patient/pages/PatientSessions';
import PatientMessages from './patient/pages/PatientMessages';
import Community from './patient/pages/Community';
import PatientSettings from './patient/pages/PatientSettings';


// --- Navigation Link Definitions ---
const counselorNavLinks = [
  { to: "/dashboard/overview", icon: <FaThLarge />, label: "Overview" },
  { to: "/dashboard/patients", icon: <FaUsers />, label: "My Patients" },
  { to: "/dashboard/sessions", icon: <FaCalendarAlt />, label: "Session Management" },
  { to: "/dashboard/messages", icon: <FaCommentAlt />, label: "Messages" },
  { to: "/dashboard/library", icon: <FaBook />, label: "Resource Library" },
  { to: "/dashboard/settings", icon: <FaCog />, label: "Settings" },
];

const patientNavLinks = [
  { to: "/patient/overview", icon: <FaThLarge />, label: "Overview" },
  { to: "/patient/counsellors", icon: <FaUserMd />, label: "Counsellors" },
  { to: "/patient/resources", icon: <FaBook />, label: "Resource Library" },
  { to: "/patient/sessions", icon: <FaCalendarAlt />, label: "Sessions" },
  { to: "/patient/messages", icon: <FaCommentAlt />, label: "Messages" },
  { to: "/patient/community", icon: <FaCommentDots />, label: "Community" },
  { to: "/patient/settings", icon: <FaCog />, label: "Settings" },
];


function App() {
  return (
    <Router>
      <Routes>
        {/* --- Main Site Routes --- */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/choose-role" element={<RoleSelectionPage />} />
        <Route path="/signup/:role" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cancer/:slug" element={<CancerInfoPage />} /> {/* Make sure this route is here */}

        {/* --- Counselor Dashboard Routes --- */}
        <Route path="/dashboard" element={<DashboardLayout navLinks={counselorNavLinks} />}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<Overview />} />
          <Route path="patients" element={<MyPatients />} />
          <Route path="sessions" element={<SessionManagement />} />
          <Route path="messages" element={<Messages />} />
          <Route path="library" element={<ResourceLibrary />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* --- Admin Dashboard Routes --- */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<AdminOverview />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="sessions" element={<SessionOversight />} />
          <Route path="reports" element={<ReportsAndInsights />} />
          <Route path="resources" element={<AdminResourceMgt />} />
          <Route path="approval" element={<ApprovalCenter />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* --- Patient Dashboard Routes --- */}
        <Route path="/patient" element={<DashboardLayout navLinks={patientNavLinks} />}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<PatientOverview />} />
          <Route path="counsellors" element={<CounsellorList />} />
          <Route path="resources" element={<PatientResources />} />
          <Route path="sessions" element={<PatientSessions />} />
          <Route path="messages" element={<PatientMessages />} />
          <Route path="community" element={<Community />} />
          <Route path="settings" element={<PatientSettings />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;