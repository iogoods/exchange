import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const token = localStorage.getItem('token');

  return (
    <nav className="bg-gray-900 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-neon-blue">
          CryptoExchange
        </Link>
        <div className="flex space-x-4">
          <Link to="/spot" className="hover:text-blue-400">Spot Trading</Link>
          <Link to="/futures" className="hover:text-blue-400">Futures Trading</Link>
          {token ? (
            <>
              <Link to="/dashboard" className="hover:text-blue-400">Dashboard</Link>
              <button onClick={handleLogout} className="hover:text-red-400">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-400">Login</Link>
              <Link to="/register" className="hover:text-blue-400">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
