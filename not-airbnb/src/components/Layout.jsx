import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-rose-500">notAirbnb</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/search" className="text-gray-700 hover:text-gray-900">
                Search
              </Link>
              {user ? (
                <>
                  <Link to="/listings" className="text-gray-700 hover:text-gray-900">
                    My Listings
                  </Link>
                  <button
                    onClick={logout}
                    className="text-gray-700 hover:text-gray-900"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-gray-900">
                    Login
                  </Link>
                  <Link to="/register" className="text-gray-700 hover:text-gray-900">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-grow">
        {children}
      </main>
      <footer className="bg-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500">
          © 2024 notAirbnb. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout; 