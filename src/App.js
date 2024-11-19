import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SpotTrading from './pages/SpotTrading';
import FuturesTrading from './pages/FuturesTrading';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import AuthGuard from './middleware/AuthGuard';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Trading Pages */}
        <Route path="/spot/:symbol" element={<SpotTrading />} />
        <Route path="/spot" element={<SpotTrading />} />
        <Route path="/futures/:symbol" element={<FuturesTrading />} />
        <Route path="/futures" element={<FuturesTrading />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User Dashboard */}
        <Route
          path="/dashboard"
          element={
            <AuthGuard>
              <UserDashboard />
            </AuthGuard>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
