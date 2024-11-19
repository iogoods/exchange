import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import SpotTradingPage from './pages/SpotTradingPage';
import FuturesTradingPage from './pages/FuturesTradingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <Router>
      <NavBar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        <Route path="/" element={<HomePage />} /> {/* HomePage als Root */}
        <Route path="/spot" element={<SpotTradingPage />} />
        <Route path="/spot/:symbol" element={<SpotTradingPage />} />
        <Route path="/futures" element={<FuturesTradingPage />} />
        <Route path="/dashboard" element={isLoggedIn ? <UserDashboard /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/" />} /> {/* Fallback zur HomePage */}
      </Routes>
    </Router>
  );
};

export default App;
