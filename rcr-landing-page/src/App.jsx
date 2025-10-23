// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Page Components
import LandingPage from './pages/LandingPage';
import RoleSelectionPage from './pages/RoleSelectionPage'; // 1. Import new page
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/choose-role" element={<RoleSelectionPage />} /> {/* 2. Add new route */}
        <Route path="/signup/:role" element={<SignupPage />} /> {/* 3. Make signup route dynamic */}
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;