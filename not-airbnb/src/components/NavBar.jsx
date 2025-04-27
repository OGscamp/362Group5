import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  HomeIcon, 
  MagnifyingGlassIcon, 
  UserIcon, 
  ChatBubbleLeftIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import CartIcon from './CartIcon';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate('/login');
    }
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold text-rose-600">
                NotAirbnb
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                <HomeIcon className="h-5 w-5 mr-1" />
                Home
              </Link>
              <Link
                to="/search"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                <MagnifyingGlassIcon className="h-5 w-5 mr-1" />
                Search
              </Link>
              {user && (
                <>
                  <Link
                    to="/listings"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    <UserIcon className="h-5 w-5 mr-1" />
                    My Listings
                  </Link>
                  <Link
                    to="/bookings"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    <CalendarIcon className="h-5 w-5 mr-1" />
                    Bookings
                  </Link>
                  <Link
                    to="/support"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Support
                  </Link>
                  <Link
                    to="/mailbox"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    <ChatBubbleLeftIcon className="h-5 w-5 mr-1" />
                    Mailbox
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <CartIcon />
                <span className="text-gray-700">Welcome, {user.username}</span>
                <button
                  onClick={handleLogout}
                  className="bg-rose-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-rose-700 inline-flex items-center"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5 mr-1" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium inline-flex items-center"
                >
                  <UserIcon className="h-5 w-5 mr-1" />
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-rose-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-rose-700 inline-flex items-center"
                >
                  <UserIcon className="h-5 w-5 mr-1" />
                  Register
                </Link>
              </div>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-rose-500"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link
            to="/"
            className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium inline-flex items-center"
          >
            <HomeIcon className="h-5 w-5 mr-2" />
            Home
          </Link>
          <Link
            to="/search"
            className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium inline-flex items-center"
          >
            <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
            Search
          </Link>
          {user && (
            <>
              <Link
                to="/listings"
                className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium inline-flex items-center"
              >
                <UserIcon className="h-5 w-5 mr-2" />
                My Listings
              </Link>
              <Link
                to="/bookings"
                className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium inline-flex items-center"
              >
                <CalendarIcon className="h-5 w-5 mr-2" />
                Bookings
              </Link>
              <Link
                to="/support"
                className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium inline-flex items-center"
              >
                Support
              </Link>
              <Link
                to="/mailbox"
                className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium inline-flex items-center"
              >
                <ChatBubbleLeftIcon className="h-5 w-5 mr-2" />
                Mailbox
              </Link>
            </>
          )}
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200">
          {user ? (
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <CartIcon />
              </div>
              <div className="ml-3">
                <span className="text-gray-700">Welcome, {user.username}</span>
              </div>
              <div className="ml-3">
                <button
                  onClick={handleLogout}
                  className="bg-rose-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-rose-700 inline-flex items-center"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5 mr-1" />
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <Link
                to="/login"
                className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 inline-flex items-center"
              >
                <UserIcon className="h-5 w-5 mr-2" />
                Login
              </Link>
              <Link
                to="/register"
                className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 inline-flex items-center"
              >
                <UserIcon className="h-5 w-5 mr-2" />
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar; 