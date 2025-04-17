import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import LoginPage from './pages/LoginPage';
import ListingsPage from './pages/ListingsPage';
import CartPage from './pages/CartPage';
import PaymentsPage from './pages/PaymentsPage';

export default function App() {
  return (
    <div>
      <NavBar />
      <div className="container">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/listings" element={<ListingsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/payments" element={<PaymentsPage />} />
          <Route path="*" element={<LoginPage />} />
        </Routes>
      </div>
    </div>
  );
}