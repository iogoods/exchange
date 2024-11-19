import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {/* Logo-Link zu Home */}
          <Link to="/" className="text-white text-xl font-bold">
            CryptoExchange
          </Link>
          <Link to="/spot" className="text-gray-300 hover:text-white">
            Spot Trading
          </Link>
          <Link to="/futures" className="text-gray-300 hover:text-white">
            Futures Trading
          </Link>
          {isLoggedIn && (
            <Link to="/dashboard" className="text-gray-300 hover:text-white">
              Dashboard
            </Link>
          )}
        </div>
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
