import React from 'react';
import { NavLink } from 'react-router-dom';

export default function NavBar() {
  return (
    <nav className="navbar">
      <div className="container">
        <h1>NotAirBNB</h1>
        <div>
          <NavLink to="/listings" className={({isActive}) => isActive ? 'active' : ''}>Listings</NavLink>
          <NavLink to="/cart" className={({isActive}) => isActive ? 'active' : ''}>Cart</NavLink>
          <NavLink to="/payments" className={({isActive}) => isActive ? 'active' : ''}>Payments</NavLink>
          <NavLink to="/login" className={({isActive}) => isActive ? 'active' : ''}>Login</NavLink>
        </div>
      </div>
    </nav>
  );
}