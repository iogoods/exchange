import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/NavBar';
import Home from './pages/Home'; // Deine bestehende Home-Seite
import Login from './pages/Login';
import Register from './pages/Register';
import SpotTrading from './pages/SpotTradingPage'; // Bereits existierende Spot-Seite
import FuturesTrading from './pages/FuturesTradingPage'; // Bereits existierende Futures-Seite
import UserDashboard from './pages/UserDashboard'; // Das UserDashboard
import AuthGuard from './middleware/AuthGuard'; // Schutz für das Dashboard

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <AuthGuard>
              <UserDashboard />
            </AuthGuard>
          }
        />
        <Route path="/spot" element={<SpotTrading />} />
        <Route path="/futures" element={<FuturesTrading />} />
      </Routes>
    </Router>
  );
};

export default App;
