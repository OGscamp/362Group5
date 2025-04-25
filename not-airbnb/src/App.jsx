import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { CartProvider } from './context/CartContext';
import { Toaster } from 'react-hot-toast';
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SearchPage from './pages/Search';
import PropertyListing from './pages/PropertyListing';
import ListingsPage from './pages/ListingsPage';
import ChatPage from './pages/ChatPage';
import ProtectedRoute from './components/ProtectedRoute';
import BookingsPage from './pages/BookingsPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <CartProvider>
            <div className="min-h-screen bg-gray-50">
              <NavBar />
              <Toaster position="top-right" />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/property/:id" element={<PropertyListing />} />
                <Route
                  path="/listings"
                  element={
                    <ProtectedRoute>
                      <ListingsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/bookings"
                  element={
                    <ProtectedRoute>
                      <BookingsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/chat"
                  element={
                    <ProtectedRoute>
                      <ChatPage />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </div>
          </CartProvider>
        </DataProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
