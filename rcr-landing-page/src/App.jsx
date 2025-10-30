// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import Main Site Pages
import LandingPage from './pages/LandingPage';
import RoleSelectionPage from './pages/RoleSelectionPage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';

// Import Counselor Dashboard
import DashboardLayout from './dashboard/DashboardLayout';
import Overview from './dashboard/pages/Overview';
import MyPatients from './dashboard/pages/MyPatients';
import SessionManagement from './dashboard/pages/SessionManagement';
import Messages from './dashboard/pages/Messages';
import ResourceLibrary from './dashboard/pages/ResourceLibrary';
import Settings from './dashboard/pages/Settings';

// Import NEW Admin Dashboard
import AdminLayout from './admin/AdminLayout';
import AdminOverview from './admin/pages/AdminOverview';
import UserManagement from './admin/pages/UserManagement';
import SessionOversight from './admin/pages/SessionOversight';
import ReportsAndInsights from './admin/pages/ReportsAndInsights';
import AdminResourceMgt from './admin/pages/AdminResourceMgt';
import ApprovalCenter from './admin/pages/ApprovalCenter';
import AdminMessages from './admin/pages/AdminMessages';
import AdminSettings from './admin/pages/AdminSettings';

function App() {
  return (
    <Router>
      <Routes>
        {/* --- Main Site Routes --- */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/choose-role" element={<RoleSelectionPage />} />
        <Route path="/signup/:role" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* --- Counselor Dashboard Routes --- */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<Overview />} />
          <Route path="patients" element={<MyPatients />} />
          <Route path="sessions" element={<SessionManagement />} />
          <Route path="messages" element={<Messages />} />
          <Route path="library" element={<ResourceLibrary />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* --- NEW Admin Dashboard Routes --- */}
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

      </Routes>
    </Router>
  );
}

export default App;