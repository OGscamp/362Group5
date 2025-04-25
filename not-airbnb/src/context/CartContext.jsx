import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (property, checkIn, checkOut, guests) => {
    const existingItem = cart.find(item => item.property._id === property._id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.property._id === property._id
          ? { ...item, checkIn, checkOut, guests }
          : item
      ));
    } else {
      setCart([...cart, { property, checkIn, checkOut, guests }]);
    }
  };

  const removeFromCart = (propertyId) => {
    setCart(cart.filter(item => item.property._id !== propertyId));
  };

  const updateCartItem = (propertyId, updates) => {
    setCart(cart.map(item =>
      item.property._id === propertyId
        ? { ...item, ...updates }
        : item
    ));
  };

  const clearCart = () => {
    setCart([]);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const checkIn = new Date(item.checkIn);
      const checkOut = new Date(item.checkOut);
      const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      return total + (item.property.price * nights);
    }, 0);
  };

  const value = {
    cart,
    loading,
    error,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    calculateTotal,
    clearError: () => setError(null)
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 